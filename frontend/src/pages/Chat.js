import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Send, 
  Smile, 
  Users, 
  Circle, 
  MoreVertical, 
  Trash2, 
  Ban,
  MessageCircle,
  Wifi,
  WifiOff,
  Shield,
  X,
  Mic,
  MicOff,
  Play,
  Pause,
  Search,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Paperclip,
  ArrowLeft
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const WS_URL = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

export const Chat = () => {
  const { user, token, isAdmin } = useAuth();
  const { language } = useLanguage();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUsersList, setShowUsersList] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);
  
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/chat/messages?limit=50`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (!token || wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setIsConnecting(true);
    const ws = new WebSocket(`${WS_URL}/api/chat/ws?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setIsConnecting(false);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'connected':
          setOnlineUsers(data.online_users || []);
          break;
        
        case 'message':
          setMessages(prev => [...prev, data.message]);
          if (document.hidden && data.message.user_id !== user?.id) {
            new Notification(`${data.message.user_name}`, {
              body: data.message.content.substring(0, 100),
              icon: LOGO_URL
            });
          }
          break;
        
        case 'user_joined':
          setOnlineUsers(prev => {
            if (prev.some(u => u.user_id === data.user.user_id)) return prev;
            return [...prev, data.user];
          });
          break;
        
        case 'user_left':
          setOnlineUsers(prev => prev.filter(u => u.user_id !== data.user_id));
          break;
        
        case 'message_deleted':
          setMessages(prev => prev.map(msg => 
            msg.id === data.message_id 
              ? { ...msg, content: '[Mensagem removida]', deleted: true }
              : msg
          ));
          break;
        
        case 'typing':
          if (data.user_id !== user?.id) {
            setTypingUsers(prev => {
              if (prev.includes(data.user_name)) return prev;
              return [...prev, data.user_name];
            });
            setTimeout(() => {
              setTypingUsers(prev => prev.filter(name => name !== data.user_name));
            }, 3000);
          }
          break;
        
        case 'banned':
          toast.error(language === 'pt' 
            ? `Você foi banido do chat. Motivo: ${data.reason}` 
            : `You were banned from chat. Reason: ${data.reason}`
          );
          ws.close();
          break;
        
        case 'system':
          setMessages(prev => [...prev, {
            id: `system-${Date.now()}`,
            content: data.content,
            message_type: 'system',
            created_at: data.created_at
          }]);
          break;
        
        case 'error':
          toast.error(data.message);
          break;
        
        default:
          break;
      }
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
      setIsConnecting(false);
      wsRef.current = null;
      
      if (event.code !== 4002) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnecting(false);
    };
    
    wsRef.current = ws;
  }, [token, user?.id, language]);

  // Initialize chat
  useEffect(() => {
    if (token) {
      loadMessages();
      connectWebSocket();
      
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [token, loadMessages, connectWebSocket]);

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'message',
      content: newMessage.trim()
    }));
    
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  // Send typing indicator
  const handleTyping = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      wsRef.current.send(JSON.stringify({ type: 'typing' }));
      
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  // Audio Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error(language === 'pt' ? 'Erro ao acessar microfone' : 'Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioBlob(null);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const sendAudioMessage = () => {
    if (audioBlob && wsRef.current?.readyState === WebSocket.OPEN) {
      // For now, send as text indicating audio
      wsRef.current.send(JSON.stringify({
        type: 'message',
        content: `🎤 ${language === 'pt' ? 'Mensagem de áudio' : 'Audio message'} (${formatRecordingTime(recordingTime)})`
      }));
      setAudioBlob(null);
      setRecordingTime(0);
      toast.success(language === 'pt' ? 'Áudio enviado!' : 'Audio sent!');
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Delete message (admin only)
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/chat/messages/${messageId}?token=${token}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        toast.success(language === 'pt' ? 'Mensagem removida' : 'Message deleted');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Ban user (admin only)
  const banUser = async () => {
    if (!userToBan || !banReason.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/api/chat/ban?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userToBan.user_id,
          reason: banReason,
          duration_hours: 24
        })
      });
      
      if (response.ok) {
        toast.success(language === 'pt' ? 'Usuário banido por 24h' : 'User banned for 24h');
        setBanDialogOpen(false);
        setUserToBan(null);
        setBanReason('');
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  // Add emoji to message
  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter users by search
  const filteredUsers = onlineUsers.filter(u => 
    u.user_name.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111b21] flex items-center justify-center p-4">
        <div className="bg-[#202c33] rounded-2xl p-8 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-[#00a884] rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {language === 'pt' ? 'Faça login para acessar o chat' : 'Login to access chat'}
          </h2>
          <p className="text-[#8696a0]">
            {language === 'pt' 
              ? 'Você precisa estar logado para participar da comunidade STUFF.'
              : 'You need to be logged in to join the STUFF community.'}
          </p>
          <a 
            href="/login"
            className="mt-6 inline-block bg-[#00a884] text-white px-8 py-3 rounded-full font-medium hover:bg-[#06cf9c] transition-colors"
          >
            {language === 'pt' ? 'Fazer Login' : 'Login'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#111b21] flex overflow-hidden" data-testid="chat-page">
      {/* Left Side - Messages */}
      <div className={`flex-1 flex flex-col bg-[#0b141a] ${!showUsersList ? 'flex' : 'hidden md:flex'}`}>
        {/* Chat Header */}
        <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 border-l border-[#2a3942]">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#aebac1] hover:bg-[#2a3942]"
              onClick={() => setShowUsersList(true)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-medium">STUFF Comunidade</h2>
              <p className="text-[#8696a0] text-xs flex items-center gap-1">
                {isConnected ? (
                  <>
                    <Circle className="h-2 w-2 fill-[#00a884] text-[#00a884]" />
                    {onlineUsers.length} {language === 'pt' ? 'online' : 'online'}
                  </>
                ) : isConnecting ? (
                  <>{language === 'pt' ? 'Conectando...' : 'Connecting...'}</>
                ) : (
                  <>
                    <Circle className="h-2 w-2 fill-red-500 text-red-500" />
                    {language === 'pt' ? 'Desconectado' : 'Disconnected'}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#aebac1] hover:bg-[#2a3942]"
            >
              <Search className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#aebac1] hover:bg-[#2a3942]">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#233138] border-[#2a3942] text-white">
                <DropdownMenuItem className="hover:bg-[#2a3942] cursor-pointer">
                  {language === 'pt' ? 'Info do grupo' : 'Group info'}
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#2a3942] cursor-pointer">
                  {language === 'pt' ? 'Limpar conversa' : 'Clear chat'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-1"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#0b141a'
          }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#8696a0]">
              <div className="w-16 h-16 bg-[#202c33] rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <p className="text-center">
                {language === 'pt' ? 'Nenhuma mensagem ainda.' : 'No messages yet.'}
                <br />
                {language === 'pt' ? 'Seja o primeiro a dizer olá!' : 'Be the first to say hello!'}
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.user_id === user?.id;
              const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.user_id !== msg.user_id);
              
              if (msg.message_type === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-lg">
                      {msg.content}
                    </span>
                  </div>
                );
              }
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`flex gap-2 max-w-[75%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                    {!isOwn && showAvatar && (
                      <Avatar className="h-8 w-8 flex-shrink-0 mt-auto">
                        <AvatarImage src={msg.user_avatar} alt={msg.user_name} />
                        <AvatarFallback className="bg-[#00a884] text-white text-xs">
                          {getInitials(msg.user_name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!isOwn && !showAvatar && <div className="w-8" />}
                    
                    <div
                      className={`relative px-3 py-2 rounded-lg ${
                        isOwn 
                          ? 'bg-[#005c4b] text-white rounded-tr-none' 
                          : 'bg-[#202c33] text-white rounded-tl-none'
                      } ${msg.deleted ? 'opacity-60 italic' : ''}`}
                    >
                      {/* Sender name for group chat */}
                      {!isOwn && showAvatar && (
                        <p className={`text-xs font-medium mb-1 ${msg.is_admin ? 'text-[#f59e0b]' : 'text-[#00a884]'}`}>
                          {msg.user_name} {msg.is_admin && '⭐'}
                        </p>
                      )}
                      
                      <p className="text-sm break-words">{msg.content}</p>
                      
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-[#8696a0]">
                          {formatTime(msg.created_at)}
                        </span>
                        {isOwn && (
                          <CheckCheck className="h-4 w-4 text-[#53bdeb]" />
                        )}
                      </div>
                      
                      {/* Tail */}
                      <div 
                        className={`absolute top-0 w-3 h-3 ${
                          isOwn 
                            ? '-right-2 bg-[#005c4b]' 
                            : '-left-2 bg-[#202c33]'
                        }`}
                        style={{
                          clipPath: isOwn 
                            ? 'polygon(0 0, 100% 0, 0 100%)' 
                            : 'polygon(100% 0, 0 0, 100% 100%)'
                        }}
                      />
                      
                      {/* Admin actions */}
                      {isAdmin && !msg.deleted && !isOwn && (
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-[#8696a0] hover:bg-[#2a3942]">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#233138] border-[#2a3942]">
                              <DropdownMenuItem 
                                onClick={() => deleteMessage(msg.id)}
                                className="text-red-400 hover:bg-[#2a3942] cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {language === 'pt' ? 'Apagar' : 'Delete'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setUserToBan({ user_id: msg.user_id, user_name: msg.user_name });
                                  setBanDialogOpen(true);
                                }}
                                className="text-red-400 hover:bg-[#2a3942] cursor-pointer"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                {language === 'pt' ? 'Banir' : 'Ban'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="px-4 py-2 text-xs text-[#00a884]">
            {typingUsers.join(', ')} {language === 'pt' ? 'está digitando...' : 'is typing...'}
          </div>
        )}

        {/* Audio Recording UI */}
        {isRecording && (
          <div className="bg-[#005c4b] px-4 py-3 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelRecording}
              className="text-white hover:bg-[#00a884]"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-mono">{formatRecordingTime(recordingTime)}</span>
              <div className="flex-1 h-1 bg-[#00a884] rounded-full overflow-hidden">
                <div className="h-full bg-white w-1/2 animate-pulse" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={stopRecording}
              className="text-white hover:bg-[#00a884]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Audio Preview */}
        {audioBlob && !isRecording && (
          <div className="bg-[#202c33] px-4 py-3 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAudioBlob(null)}
              className="text-[#8696a0] hover:bg-[#2a3942]"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-center gap-3 bg-[#2a3942] rounded-full px-4 py-2">
              <Mic className="h-4 w-4 text-[#00a884]" />
              <span className="text-white text-sm">{formatRecordingTime(recordingTime)}</span>
            </div>
            <Button
              onClick={sendAudioMessage}
              className="bg-[#00a884] hover:bg-[#06cf9c] text-white rounded-full h-10 w-10"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Message Input */}
        {!isRecording && !audioBlob && (
          <div className="bg-[#202c33] px-4 py-3 flex items-center gap-2">
            {/* Emoji Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-[#8696a0] hover:bg-[#2a3942]"
              >
                <Smile className="h-6 w-6" />
              </Button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 bg-[#202c33] rounded-full shadow z-10 text-white"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <EmojiPicker 
                      onEmojiClick={onEmojiClick}
                      width={300}
                      height={350}
                      theme="dark"
                      searchPlaceHolder={language === 'pt' ? 'Buscar emoji...' : 'Search emoji...'}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Text Input */}
            <form onSubmit={sendMessage} className="flex-1 flex items-center gap-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder={language === 'pt' ? 'Digite uma mensagem' : 'Type a message'}
                className="flex-1 bg-[#2a3942] border-none text-white placeholder:text-[#8696a0] rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={!isConnected}
                maxLength={1000}
              />
              
              {newMessage.trim() ? (
                <Button
                  type="submit"
                  disabled={!isConnected}
                  className="bg-[#00a884] hover:bg-[#06cf9c] text-white rounded-full h-10 w-10"
                >
                  <Send className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={startRecording}
                  disabled={!isConnected}
                  className="bg-[#00a884] hover:bg-[#06cf9c] text-white rounded-full h-10 w-10"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Right Side - Users List */}
      <div className={`w-full md:w-80 lg:w-96 bg-[#111b21] flex flex-col border-l border-[#2a3942] ${showUsersList ? 'flex' : 'hidden md:flex'}`}>
        {/* Users Header */}
        <div className="h-16 bg-[#202c33] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src={LOGO_URL} 
              alt="STUFF" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-white font-semibold">STUFF Online</span>
          </div>
          <div className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-[#00a884]" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-400" />
            )}
          </div>
        </div>

        {/* Search Users */}
        <div className="p-2 bg-[#111b21]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
            <Input
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder={language === 'pt' ? 'Pesquisar usuários' : 'Search users'}
              className="w-full bg-[#202c33] border-none text-white placeholder:text-[#8696a0] pl-10 rounded-lg focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Users List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-[#2a3942]">
            {/* Community Chat - Always on top */}
            <div 
              className="flex items-center gap-3 p-3 hover:bg-[#202c33] cursor-pointer bg-[#2a3942]"
              onClick={() => setShowUsersList(false)}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium truncate">STUFF Comunidade</h3>
                  <span className="text-[#8696a0] text-xs">
                    {messages.length > 0 && formatTime(messages[messages.length - 1]?.created_at)}
                  </span>
                </div>
                <p className="text-[#8696a0] text-sm truncate">
                  {messages.length > 0 
                    ? `${messages[messages.length - 1]?.user_name}: ${messages[messages.length - 1]?.content?.substring(0, 30)}...`
                    : (language === 'pt' ? 'Toque para abrir' : 'Tap to open')
                  }
                </p>
              </div>
              {messages.length > 0 && (
                <Badge className="bg-[#00a884] text-white text-xs">
                  {messages.length}
                </Badge>
              )}
            </div>

            {/* Online Users */}
            <div className="py-2 px-3">
              <p className="text-[#00a884] text-xs font-medium uppercase tracking-wider mb-2">
                {language === 'pt' ? 'Usuários Online' : 'Online Users'} ({filteredUsers.length})
              </p>
            </div>
            
            {filteredUsers.map((onlineUser) => (
              <div 
                key={onlineUser.user_id}
                className="flex items-center gap-3 p-3 hover:bg-[#202c33] cursor-pointer group"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-[#2a3942]">
                    <AvatarImage src={onlineUser.user_avatar} alt={onlineUser.user_name} />
                    <AvatarFallback className={`${onlineUser.role === 'admin' ? 'bg-amber-500' : 'bg-[#00a884]'} text-white`}>
                      {getInitials(onlineUser.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Circle className="absolute bottom-0 right-0 h-3.5 w-3.5 fill-[#00a884] text-[#00a884] border-2 border-[#111b21] rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium truncate">{onlineUser.user_name}</h3>
                    {onlineUser.role === 'admin' && (
                      <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-[#8696a0] text-sm">
                    {onlineUser.role === 'admin' 
                      ? (language === 'pt' ? 'Administrador' : 'Administrator')
                      : (language === 'pt' ? 'Estudante' : 'Student')
                    }
                  </p>
                </div>
                
                {/* Admin ban button */}
                {isAdmin && onlineUser.user_id !== user.id && onlineUser.role !== 'admin' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-500/20"
                    onClick={() => {
                      setUserToBan(onlineUser);
                      setBanDialogOpen(true);
                    }}
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-[#8696a0]">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{language === 'pt' ? 'Nenhum usuário online' : 'No users online'}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Ban Dialog */}
      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent className="bg-[#202c33] border-[#2a3942] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'pt' ? 'Banir usuário' : 'Ban user'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#8696a0]">
              {language === 'pt' 
                ? `Você está prestes a banir ${userToBan?.user_name} do chat por 24 horas.`
                : `You are about to ban ${userToBan?.user_name} from chat for 24 hours.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={language === 'pt' ? 'Motivo do banimento...' : 'Reason for ban...'}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="bg-[#2a3942] border-none text-white placeholder:text-[#8696a0]"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setUserToBan(null);
                setBanReason('');
              }}
              className="bg-transparent border-[#2a3942] text-white hover:bg-[#2a3942]"
            >
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={banUser}
              disabled={!banReason.trim()}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              {language === 'pt' ? 'Banir' : 'Ban'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
