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
  X,
  Mic,
  Play,
  Pause,
  Search,
  CheckCheck,
  ArrowLeft,
  StopCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const WS_URL = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

// Notification sound URL
const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3";

// Audio Message Component with Play button
const AudioMessage = ({ audioUrl, duration, isOwn }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const [hasError, setHasError] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  // Check if audioUrl is valid
  const isValidAudioUrl = audioUrl && typeof audioUrl === 'string' && (
    audioUrl.startsWith('data:audio/') || 
    audioUrl.startsWith('blob:') ||
    audioUrl.startsWith('http')
  );

  // Create audio element when URL changes
  useEffect(() => {
    if (!isValidAudioUrl) return;
    
    const audio = new Audio();
    
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setAudioDuration(audio.duration);
      }
      setHasError(false);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    const handleError = () => {
      console.error('Audio error for URL starting with:', audioUrl?.substring(0, 50));
      setHasError(true);
      setIsPlaying(false);
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Set source and load
    audio.src = audioUrl;
    audio.load();
    
    setAudioElement(audio);
    setHasError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, isValidAudioUrl]);

  const togglePlay = async () => {
    if (!audioElement || !isValidAudioUrl || hasError) return;

    try {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        if (audioElement.ended) {
          audioElement.currentTime = 0;
        }
        await audioElement.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Play error:', error);
      // Don't set hasError here, just log - might be user interaction required
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time) || !isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = audioDuration > 0 && isFinite(audioDuration) ? (currentTime / audioDuration) * 100 : 0;

  if (!isValidAudioUrl) {
    return (
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="h-10 w-10 rounded-full flex-shrink-0 bg-gray-200 flex items-center justify-center">
          <Mic className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400">Áudio não disponível</p>
          <span className="text-[10px] text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className={`h-10 w-10 rounded-full flex-shrink-0 ${hasError ? 'bg-gray-200' : 'bg-[#00a884] hover:bg-[#06cf9c]'} active:scale-95 transition-transform`}
      >
        {hasError ? (
          <Mic className="h-5 w-5 text-gray-400" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5 text-white" />
        ) : (
          <Play className="h-5 w-5 text-white ml-0.5" />
        )}
      </Button>
      <div className="flex-1">
        {hasError ? (
          <p className="text-xs text-gray-400">Formato não suportado</p>
        ) : (
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00a884] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-gray-500">
            {isPlaying ? formatTime(currentTime) : formatTime(audioDuration || duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Chat = () => {
  const { user, token, isAdmin } = useAuth();
  const { language } = useLanguage();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const notificationSoundRef = useRef(null);
  const previewAudioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Hide Emergent badge on chat page
  useEffect(() => {
    // Hide any fixed positioned elements that might be the Emergent badge
    const style = document.createElement('style');
    style.id = 'hide-emergent-badge';
    style.textContent = `
      /* Hide Emergent badge completely on chat */
      div[style*="position: fixed"][style*="bottom"],
      div[style*="Made with Emergent"],
      div[style*="position:fixed"][style*="bottom"],
      iframe[src*="emergent"],
      [class*="emergent"],
      div:has(> a[href*="emergent"]),
      div:has(> span:contains("Emergent")),
      div[style*="z-index: 9999"],
      div[style*="z-index:9999"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
    
    // Also try to find and hide the badge directly
    const hideBadge = () => {
      const elements = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"]');
      elements.forEach(el => {
        if (el.innerHTML.includes('Emergent') || el.textContent.includes('Emergent')) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.remove();
        }
      });
    };
    
    hideBadge();
    const interval = setInterval(hideBadge, 500);
    
    return () => {
      clearInterval(interval);
      const existingStyle = document.getElementById('hide-emergent-badge');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  // Initialize notification sound
  useEffect(() => {
    notificationSoundRef.current = new Audio(NOTIFICATION_SOUND_URL);
    notificationSoundRef.current.volume = 0.5;
    // Load sound preference
    const savedPref = localStorage.getItem('chat_sound_enabled');
    if (savedPref !== null) setSoundEnabled(savedPref === 'true');
  }, []);

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('chat_sound_enabled', newValue.toString());
  };

  const playNotificationSound = useCallback(() => {
    if (soundEnabled && notificationSoundRef.current) {
      notificationSoundRef.current.currentTime = 0;
      notificationSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  }, [soundEnabled]);

  // Scroll to bottom
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
          // Play notification sound for messages from others
          if (data.message.user_id !== user?.id) {
            playNotificationSound();
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
          toast.error(`Você foi banido. Motivo: ${data.reason}`);
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
        default:
          break;
      }
    };
    
    ws.onclose = (event) => {
      setIsConnected(false);
      setIsConnecting(false);
      wsRef.current = null;
      if (event.code !== 4002) {
        reconnectTimeoutRef.current = setTimeout(() => connectWebSocket(), 3000);
      }
    };
    
    ws.onerror = () => setIsConnecting(false);
    wsRef.current = ws;
  }, [token, user?.id, playNotificationSound]);

  useEffect(() => {
    if (token) {
      loadMessages();
      connectWebSocket();
    }
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [token, loadMessages, connectWebSocket]);

  // Send text message
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

  // Typing indicator
  const handleTyping = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      wsRef.current.send(JSON.stringify({ type: 'typing' }));
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  // Audio Recording - with format compatibility check
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // iOS Safari supports audio/mp4, Chrome/Firefox support webm
      // Check supported MIME types - prioritize mp4 for iOS compatibility
      const mimeTypes = [
        'audio/mp4',           // iOS Safari
        'audio/aac',           // iOS fallback  
        'audio/mpeg',          // MP3
        'audio/webm;codecs=opus', // Chrome/Firefox
        'audio/webm',          // Chrome/Firefox fallback
        'audio/ogg;codecs=opus',
        ''                     // Let browser choose default
      ];
      
      let selectedMimeType = '';
      for (const type of mimeTypes) {
        if (type === '' || MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          console.log('Selected MIME type:', type || 'default');
          break;
        }
      }
      
      const options = selectedMimeType ? { mimeType: selectedMimeType } : {};
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];
      
      console.log('Recording started with MIME type:', mediaRecorderRef.current.mimeType);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current.mimeType || 'audio/mp4';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        console.log('Audio blob created, type:', mimeType, 'size:', blob.size);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao acessar microfone' : 'Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    // Stop preview if playing
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPreviewPlaying(false);
    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
  };

  // Play/Pause preview audio
  const togglePreviewPlay = async () => {
    if (!audioUrl) return;
    
    try {
      if (isPreviewPlaying && previewAudioRef.current) {
        previewAudioRef.current.pause();
        setIsPreviewPlaying(false);
      } else {
        // Create new audio element if needed
        if (!previewAudioRef.current) {
          previewAudioRef.current = new Audio(audioUrl);
          previewAudioRef.current.onended = () => setIsPreviewPlaying(false);
        }
        await previewAudioRef.current.play();
        setIsPreviewPlaying(true);
      }
    } catch (error) {
      console.error('Preview play error:', error);
      toast.error(language === 'pt' ? 'Erro ao reproduzir áudio' : 'Error playing audio');
    }
  };

  const sendAudioMessage = async () => {
    // Check if WebSocket is connected
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast.error(language === 'pt' ? 'Não conectado ao chat. Reconectando...' : 'Not connected to chat. Reconnecting...');
      connectWebSocket();
      return;
    }
    
    if (!audioBlob) {
      toast.error(language === 'pt' ? 'Nenhum áudio para enviar' : 'No audio to send');
      return;
    }
    
    try {
      // Stop preview if playing
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      setIsPreviewPlaying(false);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result;
        console.log('Sending audio, data length:', base64Audio?.length);
        
        try {
          wsRef.current.send(JSON.stringify({
            type: 'message',
            content: `🎤 Mensagem de voz (${formatRecordingTime(recordingTime)})`,
            message_type: 'audio',
            audio_data: base64Audio,
            audio_duration: recordingTime
          }));
          setAudioBlob(null);
          setAudioUrl(null);
          setRecordingTime(0);
          toast.success(language === 'pt' ? 'Áudio enviado!' : 'Audio sent!');
        } catch (sendError) {
          console.error('Send error:', sendError);
          toast.error(language === 'pt' ? 'Erro ao enviar. Tente novamente.' : 'Error sending. Try again.');
        }
      };
      reader.onerror = () => {
        toast.error(language === 'pt' ? 'Erro ao processar áudio' : 'Error processing audio');
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Audio send error:', error);
      toast.error(language === 'pt' ? 'Erro ao enviar áudio' : 'Error sending audio');
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Delete message (user can delete own, admin can delete any)
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/api/chat/messages/${messageId}?token=${token}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success(language === 'pt' ? 'Mensagem apagada' : 'Message deleted');
      } else {
        const error = await response.json();
        toast.error(error.detail || (language === 'pt' ? 'Erro ao apagar' : 'Error deleting'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(language === 'pt' ? 'Erro ao apagar mensagem' : 'Error deleting message');
    }
  };

  // Ban user (admin)
  const banUser = async () => {
    if (!userToBan || !banReason.trim()) return;
    try {
      await fetch(`${API_URL}/api/chat/ban?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userToBan.user_id, reason: banReason, duration_hours: 24 })
      });
      toast.success(language === 'pt' ? 'Usuário banido por 24h' : 'User banned for 24h');
      setBanDialogOpen(false);
      setUserToBan(null);
      setBanReason('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = onlineUsers.filter(u => 
    u.user_name.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Check if message is audio
  const isAudioMessage = (content) => {
    return content && content.startsWith('[AUDIO:');
  };

  const getAudioDuration = (content) => {
    const match = content.match(/\[AUDIO:(\d+)\]/);
    return match ? parseInt(match[1]) : 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-lg">
          <img src={LOGO_URL} alt="STUFF" className="w-20 h-20 rounded-full mx-auto mb-6 object-cover" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {language === 'pt' ? 'Faça login para acessar o chat' : 'Login to access chat'}
          </h2>
          <p className="text-gray-500 mb-6">
            {language === 'pt' 
              ? 'Você precisa estar logado para participar da comunidade STUFF.'
              : 'You need to be logged in to join the STUFF community.'}
          </p>
          <a href="/login" className="inline-block bg-[#00a884] text-white px-8 py-3 rounded-full font-medium hover:bg-[#06cf9c] transition-colors">
            {language === 'pt' ? 'Fazer Login' : 'Login'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col md:flex-row" style={{ height: '100dvh' }} data-testid="chat-page">
      
      {/* LEFT SIDEBAR - WhatsApp Style */}
      <div className={`w-full md:w-[420px] bg-white flex flex-col border-r border-gray-200 ${!showUsersList ? 'hidden md:flex' : 'flex'}`}>
        {/* Sidebar Header */}
        <div className="h-14 bg-[#00a884] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={LOGO_URL} className="object-cover" />
              <AvatarFallback className="bg-white text-[#00a884]">{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSound}
              className="text-white hover:bg-white/20"
              title={soundEnabled ? 'Desativar som' : 'Ativar som'}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-red-200" />}
            </Button>
            <a href="/" className="text-white hover:bg-white/20 p-2 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder={language === 'pt' ? 'Pesquisar ou começar uma nova conversa' : 'Search or start a new chat'}
              className="w-full bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 pl-10 rounded-lg h-9 focus-visible:ring-[#00a884]"
            />
          </div>
        </div>

        {/* Community Chat Entry - Featured */}
        <div 
          className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() => setShowUsersList(false)}
        >
          <div className="relative">
            <img src={LOGO_URL} alt="STUFF" className="w-12 h-12 rounded-full object-cover" />
            <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-[#00a884] text-[#00a884] border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-800 font-medium">STUFF Comunidade</h3>
              <span className="text-gray-500 text-xs">
                {messages.length > 0 && formatTime(messages[messages.length - 1]?.created_at)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm truncate flex-1">
                {messages.length > 0 
                  ? `${messages[messages.length - 1]?.user_name}: ${messages[messages.length - 1]?.content?.substring(0, 30)}...` 
                  : language === 'pt' ? 'Toque para abrir o chat' : 'Tap to open chat'}
              </p>
              {messages.length > 0 && (
                <Badge className="bg-[#00a884] text-white text-xs ml-2">{messages.length > 99 ? '99+' : messages.length}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Online Users Section */}
        <div className="px-4 py-2 bg-gray-50">
          <p className="text-[#00a884] text-xs font-medium uppercase tracking-wide">
            {language === 'pt' ? 'Membros Online' : 'Online Members'} ({filteredUsers.length})
          </p>
        </div>
        
        <ScrollArea className="flex-1 bg-white">
          <div>
            {filteredUsers.map((onlineUser) => (
              <div key={onlineUser.user_id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer group border-b border-gray-100">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    {onlineUser.role === 'admin' ? (
                      <AvatarImage src={LOGO_URL} className="object-cover" />
                    ) : (
                      <AvatarImage src={onlineUser.user_avatar} />
                    )}
                    <AvatarFallback className={`${onlineUser.role === 'admin' ? 'bg-amber-500' : 'bg-[#00a884]'} text-white`}>
                      {getInitials(onlineUser.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-[#00a884] text-[#00a884] border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-800 font-medium truncate">{onlineUser.user_name}</h3>
                    {onlineUser.role === 'admin' && <Badge className="bg-amber-100 text-amber-600 text-xs border-0">Admin</Badge>}
                  </div>
                  <p className="text-gray-500 text-sm">{onlineUser.role === 'admin' ? 'Administrador' : 'Estudante'}</p>
                </div>
                {isAdmin && onlineUser.user_id !== user.id && onlineUser.role !== 'admin' && (
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50" onClick={() => { setUserToBan(onlineUser); setBanDialogOpen(true); }}>
                    <Ban className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{language === 'pt' ? 'Nenhum usuário online' : 'No users online'}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT - Chat Area */}
      <div className={`flex-1 flex flex-col min-h-0 ${showUsersList ? 'hidden md:flex' : 'flex'}`}>
        {/* Chat Header */}
        <div className="h-14 bg-[#00a884] flex items-center justify-between px-4 flex-shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUsersList(true)}
              className="md:hidden text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={LOGO_URL} alt="STUFF" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
            <div>
              <h2 className="text-white font-medium">STUFF Comunidade</h2>
              <p className="text-white/80 text-xs flex items-center gap-1">
                {isConnected ? (
                  <><Circle className="h-2 w-2 fill-white text-white" />{onlineUsers.length} {language === 'pt' ? 'online' : 'online'}</>
                ) : isConnecting ? (language === 'pt' ? 'Conectando...' : 'Connecting...') : (
                  <><Circle className="h-2 w-2 fill-red-300 text-red-300" />{language === 'pt' ? 'Desconectado' : 'Disconnected'}</>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSound}
              className="text-white hover:bg-white/20 h-9 w-9"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-red-200" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUsersList(true)}
              className="md:hidden text-white hover:bg-white/20"
            >
              <Users className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"
          style={{ backgroundColor: '#e5ddd5', backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3Oeli0teleO...")' }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <img src={LOGO_URL} alt="STUFF" className="w-20 h-20 rounded-full mb-4 opacity-50" />
              <p className="text-lg">{language === 'pt' ? 'Bem-vindo ao Chat!' : 'Welcome to Chat!'}</p>
              <p className="text-sm">{language === 'pt' ? 'Seja o primeiro a enviar uma mensagem' : 'Be the first to send a message'}</p>
              <p className="text-xs mt-4 text-[#00a884]">💡 {language === 'pt' ? 'Digite @AgenteComunidade para tirar dúvidas' : 'Type @AgenteComunidade to ask questions'}</p>
            </div>
          ) : (
            messages.filter(msg => !msg.deleted).map((msg, index) => {
              const isOwn = msg.user_id === user?.id;
              const isAgent = msg.is_agent || msg.user_id === 'agente-comunidade-stuff';
              const filteredMessages = messages.filter(m => !m.deleted);
              const prevMsg = index > 0 ? filteredMessages[index - 1] : null;
              const showAvatar = !isOwn && (!prevMsg || prevMsg.user_id !== msg.user_id);
              
              if (msg.message_type === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-lg">{msg.content}</span>
                  </div>
                );
              }
              
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
                  <div className={`flex gap-2 max-w-[85%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                    {!isOwn && showAvatar && (
                      <Avatar className={`h-8 w-8 flex-shrink-0 mt-auto ${isAgent ? 'ring-2 ring-[#00a884]' : ''}`}>
                        {isAgent || msg.is_admin ? (
                          <AvatarImage src={LOGO_URL} className="object-cover" />
                        ) : (
                          <AvatarImage src={msg.user_avatar} />
                        )}
                        <AvatarFallback className={isAgent || msg.is_admin ? "bg-[#00a884] text-white" : "bg-[#00a884] text-white text-xs"}>
                          {isAgent ? 'S' : getInitials(msg.user_name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!isOwn && !showAvatar && <div className="w-8" />}
                    
                    <div className={`relative px-3 py-2 rounded-lg shadow-sm ${
                      isOwn 
                        ? 'bg-[#dcf8c6] rounded-tr-none' 
                        : isAgent 
                          ? 'bg-[#d9fdd3] border border-[#00a884]/20 rounded-tl-none' 
                          : 'bg-white rounded-tl-none'
                    }`}>
                      {!isOwn && showAvatar && (
                        <p className={`text-xs font-medium mb-1 ${
                          isAgent 
                            ? 'text-[#00a884] flex items-center gap-1' 
                            : msg.is_admin 
                              ? 'text-amber-600' 
                              : 'text-[#00a884]'
                        }`}>
                          {msg.user_name} 
                          {isAgent && <Badge className="ml-1 bg-[#00a884]/10 text-[#00a884] text-[10px] px-1 py-0 border border-[#00a884]/30">IA</Badge>}
                          {msg.is_admin && !isAgent && '⭐'}
                        </p>
                      )}
                      
                      {/* Audio Message with Play Button */}
                      {msg.message_type === 'audio' && msg.audio_data ? (
                        <AudioMessage 
                          audioUrl={msg.audio_data} 
                          duration={msg.audio_duration || 0}
                          isOwn={isOwn}
                        />
                      ) : isAudioMessage(msg.content) ? (
                        <div className="flex items-center gap-2 min-w-[180px]">
                          <div className="h-9 w-9 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0">
                            <Mic className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{msg.content}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">{msg.content}</p>
                      )}
                      
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">{formatTime(msg.created_at)}</span>
                        {isOwn && <CheckCheck className="h-4 w-4 text-[#53bdeb]" />}
                      </div>
                      
                      {/* Delete button - shows on hover/tap for own messages or admin */}
                      {(isOwn || isAdmin) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMessage(msg.id)}
                          className="absolute -right-1 -top-1 h-6 w-6 bg-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-opacity shadow-sm"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
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
          <div className="px-4 py-1 text-xs text-[#00a884] bg-gray-100">
            {typingUsers.join(', ')} {language === 'pt' ? 'digitando...' : 'typing...'}
          </div>
        )}

        {/* Recording UI */}
        {isRecording && (
          <div className="bg-[#00a884] px-4 pt-3 pb-20 md:pb-3 flex items-center gap-3 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={cancelRecording} className="text-white hover:bg-white/20">
              <Trash2 className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-mono text-sm">{formatRecordingTime(recordingTime)}</span>
              <div className="flex-1 flex items-center gap-0.5">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="w-1 bg-white/50 rounded-full animate-pulse" style={{ height: `${Math.random() * 16 + 4}px`, animationDelay: `${i * 50}ms` }} />
                ))}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={stopRecording} className="text-white hover:bg-white/20">
              <StopCircle className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Audio Preview */}
        {audioBlob && !isRecording && (
          <div className="bg-gray-100 px-4 pt-3 pb-20 md:pb-3 flex items-center gap-3 flex-shrink-0 border-t border-gray-200">
            <Button variant="ghost" size="icon" onClick={cancelRecording} className="text-red-500 hover:bg-red-50">
              <Trash2 className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={togglePreviewPlay}
                className="h-8 w-8 rounded-full bg-[#00a884] hover:bg-[#06cf9c]"
              >
                {isPreviewPlaying ? (
                  <Pause className="h-4 w-4 text-white" />
                ) : (
                  <Play className="h-4 w-4 text-white ml-0.5" />
                )}
              </Button>
              <div className="flex-1 flex items-center gap-0.5">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`w-1 rounded-full ${isPreviewPlaying ? 'bg-[#00a884] animate-pulse' : 'bg-gray-300'}`} style={{ height: `${Math.random() * 12 + 4}px` }} />
                ))}
              </div>
              <span className="text-gray-600 text-sm">{formatRecordingTime(recordingTime)}</span>
            </div>
            <Button onClick={sendAudioMessage} className="bg-[#00a884] hover:bg-[#06cf9c] text-white rounded-full h-10 w-10">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Message Input */}
        {!isRecording && !audioBlob && (
          <>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="bg-white border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-600 text-sm">Emojis</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-100" onClick={() => setShowEmojiPicker(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <EmojiPicker 
                  onEmojiClick={onEmojiClick} 
                  width="100%" 
                  height={280} 
                  theme="light"
                  searchPlaceholder="Buscar emoji..."
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
            
            {/* Agent hint */}
            {messages.length > 0 && messages.length % 15 === 5 && (
              <div className="bg-[#d9fdd3] px-3 py-2 text-center border-t border-[#00a884]/20">
                <p className="text-[#00a884] text-xs">
                  💡 {language === 'pt' 
                    ? 'Dica: Digite @AgenteComunidade para tirar dúvidas sobre intercâmbio!' 
                    : 'Tip: Type @AgenteComunidade to ask questions about studying abroad!'}
                </p>
              </div>
            )}
            
            <div className="bg-gray-100 px-3 pt-3 pb-20 md:pb-3 flex items-center gap-2 flex-shrink-0 border-t border-gray-200">
              <Button variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-500 hover:bg-gray-200 h-10 w-10">
                {showEmojiPicker ? <X className="h-6 w-6" /> : <Smile className="h-6 w-6" />}
              </Button>

              <form onSubmit={sendMessage} className="flex-1 flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                  placeholder={language === 'pt' ? 'Mensagem ou @AgenteComunidade...' : 'Message or @AgenteComunidade...'}
                  className="flex-1 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-full h-11 text-base focus-visible:ring-[#00a884] shadow-sm"
                  disabled={!isConnected}
                  autoComplete="off"
                  autoCorrect="off"
                  enterKeyHint="send"
                  onFocus={() => setShowEmojiPicker(false)}
                />
                
                {newMessage.trim() ? (
                  <Button type="submit" disabled={!isConnected} className="bg-[#00a884] hover:bg-[#06cf9c] text-white rounded-full h-11 w-11 flex-shrink-0">
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button type="button" onClick={startRecording} disabled={!isConnected} className="bg-[#00a884] hover:bg-[#06cf9c] text-white rounded-full h-11 w-11 flex-shrink-0">
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
              </form>
            </div>
          </>
        )}
      </div>

      {/* Ban Dialog */}
      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent className="bg-white border-gray-200 text-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'pt' ? 'Banir usuário' : 'Ban user'}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              {language === 'pt' ? `Banir ${userToBan?.user_name} por 24 horas.` : `Ban ${userToBan?.user_name} for 24 hours.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input placeholder={language === 'pt' ? 'Motivo...' : 'Reason...'} value={banReason} onChange={(e) => setBanReason(e.target.value)} className="bg-[#2a3942] border-none text-white" />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setUserToBan(null); setBanReason(''); }} className="bg-transparent border-[#2a3942] text-white hover:bg-[#2a3942]">
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={banUser} disabled={!banReason.trim()} className="bg-red-600 hover:bg-red-500 text-white">
              {language === 'pt' ? 'Banir' : 'Ban'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
