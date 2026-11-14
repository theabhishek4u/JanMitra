'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  Sparkles, 
  Mic, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  MapIcon, 
  ArrowRight,
  XCircle,
  Info,
  Loader2,
  Search,
  Globe,
  TrendingUp,
  Camera,
  Video,
  FileAudio,
  Paperclip,
  Trash2,
  FilePlay,
  FileDown,
  Shield,
  Zap,
  Send,
  ChevronDown,
  Eye,
  Wand2,
  MessageSquare,
  Target,
  BarChart3,
  Clock,
  Lightbulb,
  Hash, Users, Layers
} from 'lucide-react';

const CATEGORIES = [
  "Road", "Bridge", "School", "College", "Hospital", "PHC", 
  "Water Supply", "Drainage", "Street Lights", "Electricity", 
  "Library", "Park", "Sports Ground", "Skill Center", "Women's Safety", 
  "Public Transport", "Internet", "Waste Management", "Environment", 
  "Agriculture", "Others"
];

const POPULAR_CATEGORIES = [
  { name: 'Road', icon: '🛣️', label: 'Roads & Bridges' },
  { name: 'Water Supply', icon: '💧', label: 'Water Supply' },
  { name: 'Hospital', icon: '🏥', label: 'Health & PHC' },
  { name: 'School', icon: '🏫', label: 'Schools & Edu' },
  { name: 'Street Lights', icon: '⚡', label: 'Street Lights' },
  { name: 'Waste Management', icon: '🧹', label: 'Sanitation' },
];

const QUICK_TEMPLATES = [
  {
    icon: '🛣️',
    label: 'Road Potholes & Damage',
    category: 'Road',
    urgency: 'high',
    beneficiaries: '3500',
    village: 'Sigra Ward',
    block: 'Varanasi City',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221002',
    lat: 25.3191,
    lng: 82.9754,
    title: 'Urgent Reconstruction of Damaged Main Road with Severe Potholes',
    description: 'The main connecting road has severe potholes measuring over 1 foot deep. During rainfall, complete waterlogging occurs, causing daily motorcycle skidding and serious safety hazards for school buses. Reconstruction with proper drainage is urgently needed.'
  },
  {
    icon: '💧',
    label: 'Contaminated Tap Water',
    category: 'Water Supply',
    urgency: 'critical',
    beneficiaries: '1200',
    village: 'Gomti Nagar',
    block: 'Lucknow East',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    lat: 26.8500,
    lng: 80.9900,
    title: 'Installation of Community RO Drinking Water Plant for Contaminated Pipeline',
    description: 'Tap water in our locality contains excessive dissolved solids and muddy sediment. Over 400 families are forced to purchase private water cans daily. We request installation of a community RO filtration unit.'
  },
  {
    icon: '⚡',
    label: 'Dark Street Light Outage',
    category: 'Street Lights',
    urgency: 'medium',
    beneficiaries: '850',
    village: 'Hazratganj',
    block: 'Lucknow Central',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    lat: 26.8467,
    lng: 80.9462,
    title: 'Installation of LED Street Lights along 1.5 KM Residential Stretch',
    description: 'A 1.5 km stretch from the main intersection to our colony has no functional street lighting. Multiple theft incidents and pedestrian difficulties have occurred after sunset. Installation of solar or LED street poles is requested.'
  },
  {
    icon: '🏥',
    label: 'Doctor Shortage at PHC',
    category: 'Hospital',
    urgency: 'high',
    beneficiaries: '5000',
    village: 'Cantonment',
    block: 'Varanasi City',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221001',
    lat: 25.3176,
    lng: 82.9739,
    title: 'Emergency Doctor & Essential Medicines Posting at Local PHC',
    description: 'Our Primary Health Center (PHC) has been operating without a permanent doctor for 3 weeks. Patients traveling 18 km to the district hospital face critical delays. We urge immediate deputation of medical staff and anti-venom/first-aid supplies.'
  }
];

const PINCODE_MAP: Record<string, { state: string; district: string; block: string; village: string; lat: number; lng: number }> = {
  // Lucknow
  '226001': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Lucknow Central', village: 'Hazratganj', lat: 26.8467, lng: 80.9462 },
  '226002': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Charbagh', village: 'Charbagh', lat: 26.8324, lng: 80.9238 },
  '226003': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Chowk', village: 'Chowk', lat: 26.8683, lng: 80.9029 },
  '226004': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Aminabad', village: 'Aminabad', lat: 26.8488, lng: 80.9276 },
  '226005': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Mahanagar', village: 'Mahanagar', lat: 26.8778, lng: 80.9525 },
  '226006': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Aliganj', village: 'Aliganj', lat: 26.8924, lng: 80.9419 },
  '226007': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Saadatganj', village: 'Saadatganj', lat: 26.8571, lng: 80.8926 },
  '226008': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Rajajipuram', village: 'Rajajipuram', lat: 26.8402, lng: 80.8845 },
  '226010': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Lucknow East', village: 'Gomti Nagar', lat: 26.8500, lng: 80.9900 },
  '226011': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Lucknow Cantt', village: 'Cantonment', lat: 26.8150, lng: 80.9600 },
  '226012': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Manak Nagar', village: 'Manak Nagar', lat: 26.8050, lng: 80.8950 },
  '226016': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Indira Nagar', village: 'Indira Nagar', lat: 26.8800, lng: 80.9800 },
  '226020': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Aashiana', village: 'Aashiana', lat: 26.7925, lng: 80.9150 },
  '226021': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Jankipuram', village: 'Jankipuram', lat: 26.9150, lng: 80.9350 },
  '226022': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Vikas Nagar', village: 'Vikas Nagar', lat: 26.8950, lng: 80.9650 },
  '226024': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Telibagh', village: 'Telibagh', lat: 26.7850, lng: 80.9350 },
  '226028': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Chinhat', village: 'Chinhat', lat: 26.8800, lng: 81.0400 },
  '226030': { state: 'Uttar Pradesh', district: 'Lucknow', block: 'Sushant Golf City', village: 'The Centrum, Sushant Golf City', lat: 26.7825, lng: 81.0185 },

  // Varanasi
  '221001': { state: 'Uttar Pradesh', district: 'Varanasi', block: 'Varanasi City', village: 'Cantonment', lat: 25.3176, lng: 82.9739 },
  '221002': { state: 'Uttar Pradesh', district: 'Varanasi', block: 'Varanasi City', village: 'Sigra Ward', lat: 25.3191, lng: 82.9754 },
  '221003': { state: 'Uttar Pradesh', district: 'Varanasi', block: 'Kashi', village: 'Chowk Kashi', lat: 25.3109, lng: 83.0107 },
  '221005': { state: 'Uttar Pradesh', district: 'Varanasi', block: 'BHU', village: 'Lanka', lat: 25.2677, lng: 82.9913 },
  '221010': { state: 'Uttar Pradesh', district: 'Varanasi', block: 'Varanasi North', village: 'Shivpur', lat: 25.3582, lng: 82.9621 },

  // Other major cities
  '110001': { state: 'Delhi', district: 'New Delhi', block: 'Connaught Place', village: 'Central Delhi', lat: 28.6139, lng: 77.2090 },
  '201301': { state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', block: 'Noida', village: 'Sector 18', lat: 28.5355, lng: 77.3910 },
  '208001': { state: 'Uttar Pradesh', district: 'Kanpur Nagar', block: 'Kanpur', village: 'Civil Lines', lat: 26.4499, lng: 80.3319 },
  '282001': { state: 'Uttar Pradesh', district: 'Agra', block: 'Agra City', village: 'Tajganj', lat: 27.1767, lng: 78.0081 },
  '800001': { state: 'Bihar', district: 'Patna', block: 'Patna Central', village: 'Fraser Road', lat: 25.5941, lng: 85.1376 },
  '400001': { state: 'Maharashtra', district: 'Mumbai', block: 'South Mumbai', village: 'Fort', lat: 18.9388, lng: 72.8354 },
  '560001': { state: 'Karnataka', district: 'Bengaluru Urban', block: 'Central', village: 'MG Road', lat: 12.9716, lng: 77.5946 },
};

const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-900 animate-pulse rounded-xl border border-slate-800 flex items-center justify-center text-slate-500">Loading Map...</div>
});

export default function SubmitSuggestion() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  // General Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Road');
  const [state, setState] = useState(user?.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState(user?.district || 'Varanasi');
  const [block, setBlock] = useState('');
  const [village, setVillage] = useState(user?.village_ward || 'Sigra Ward');
  const [urgency, setUrgency] = useState('medium');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [pincode, setPincode] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [language, setLanguage] = useState(user?.language_preference || 'Hindi');

  // Reverse geocoding states
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoSuccess, setGeoSuccess] = useState<string | null>(null);

  // Multi-Media Attachments
  interface Attachment {
    id: string;
    file: File;
    preview: string;
    type: 'image' | 'video' | 'audio' | 'document';
  }
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Audio Recorder States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const speechRecognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef('');

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [questionAnswer, setQuestionAnswer] = useState('');

  // Drag & drop state and handlers
  const [isDragging, setIsDragging] = useState(false);
  
  // Image Analysis State
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<{
    detected: string;
    confidence: string;
    estimatedValue: string;
    severity: string;
  } | null>(null);

  const analyzeImage = async (file: File) => {
    setIsAnalyzingImage(true);
    setImageAnalysis(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/ai/analyze-image`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setImageAnalysis(data);
      }
    } catch (err) {
      console.error('Failed to analyze image:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const processFiles = (files: FileList | File[]) => {
    const newAttachments: Attachment[] = [];
    let firstImage: File | null = null;
    
    Array.from(files).forEach((file) => {
      let type: 'image' | 'video' | 'audio' | 'document' = 'document';
      if (file.type.startsWith('image/')) {
        type = 'image';
        if (!firstImage) firstImage = file;
      }
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) type = 'document';
      
      const preview = URL.createObjectURL(file);
      newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        type
      });
    });
    
    setAttachments((prev) => [...prev, ...newAttachments]);

    if (firstImage) {
      analyzeImage(firstImage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    e.target.value = ''; // reset so same file can be added again if removed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (idToRemove: string) => {
    setAttachments(prev => prev.filter(att => att.id !== idToRemove));
  };

  // Submit Result Modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message?: string;
    isDuplicate?: boolean;
    duplicateOfId?: string;
    suggestionId?: string;
  } | null>(null);

  const [showPreview, setShowPreview] = useState(false);

  // Consensus Engine: Duplicate Interception States
  const [duplicateFoundInfo, setDuplicateFoundInfo] = useState<{
    id: string;
    title: string;
    status: string;
    supportCount: number;
    similarity?: number;
  } | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [ignoreDuplicateWarning, setIgnoreDuplicateWarning] = useState(false);
  const [isSupportingFromModal, setIsSupportingFromModal] = useState(false);
  const [modalSupportSuccess, setModalSupportSuccess] = useState(false);

  // Synchronize location fields when user profile loads
  useEffect(() => {
    if (user) {
      if (user.state) setState(user.state);
      if (user.district) setDistrict(user.district);
      if (user.village_ward) setVillage(user.village_ward);
      if (user.pincode) {
        setPincode(user.pincode);
        if (PINCODE_MAP[user.pincode]) {
          const pm = PINCODE_MAP[user.pincode];
          setBlock(pm.block);
          setLat(pm.lat);
          setLng(pm.lng);
        }
      }
    }
  }, [user]);

  // Reverse Geocode from lat/lng using OpenStreetMap Nominatim
  const reverseGeocodeFromCoords = useCallback(async (latitude: number, longitude: number) => {
    setGeoLoading(true);
    setGeoError(null);
    setGeoSuccess(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&accept-language=en`,
        { headers: { 'User-Agent': 'JansunwaiAI/1.0' } }
      );
      if (!response.ok) throw new Error('Geocoding service unavailable');
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const addr = data.address || {};
      const resolvedState = addr.state || addr.region || '';
      const resolvedDistrict = addr.city || addr.county || addr.state_district || addr.city_district || '';
      const resolvedBlock = addr.suburb || addr.neighbourhood || addr.borough || addr.town || addr.municipality || '';
      const resolvedVillage = addr.village || addr.suburb || addr.neighbourhood || addr.hamlet || addr.residential || addr.road || resolvedBlock || (resolvedDistrict ? `${resolvedDistrict} Ward` : '');
      const resolvedPincode = addr.postcode || '';

      if (resolvedState) setState(resolvedState);
      if (resolvedDistrict) setDistrict(resolvedDistrict);
      if (resolvedBlock) setBlock(resolvedBlock);
      if (resolvedVillage) setVillage(resolvedVillage);
      if (resolvedPincode) setPincode(resolvedPincode);

      setGeoSuccess(`Location resolved: ${resolvedVillage || resolvedDistrict}, ${resolvedDistrict}, ${resolvedState}`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to resolve location';
      setGeoError(`Reverse geocoding failed: ${errMsg}. You can manually fill in the fields.`);
    } finally {
      setGeoLoading(false);
    }
  }, []);

  // Geocode from Pincode with instant local cache + Indian Postal API + Nominatim search
  const geocodeFromPincode = useCallback(async (code: string) => {
    if (code.length !== 6 || !/^\d{6}$/.test(code)) return;
    setGeoLoading(true);
    setGeoError(null);
    setGeoSuccess(null);

    // 1. Instant local lookup for popular Indian pincodes
    if (PINCODE_MAP[code]) {
      const p = PINCODE_MAP[code];
      setState(p.state);
      setDistrict(p.district);
      setBlock(p.block);
      setVillage(p.village);
      setLat(p.lat);
      setLng(p.lng);
      setGeoSuccess(`Location resolved: ${p.village}, ${p.district}, ${p.state}`);
      setGeoLoading(false);
      return;
    }

    // 2. High-accuracy Indian Postal Service API
    try {
      const postalRes = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      if (postalRes.ok) {
        const postalData = await postalRes.json();
        if (postalData && postalData[0]?.Status === 'Success' && postalData[0].PostOffice?.length > 0) {
          const po = postalData[0].PostOffice[0];
          const resolvedState = po.State || '';
          const resolvedDistrict = po.District || '';
          const resolvedBlock = po.Block && po.Block !== 'NA' ? po.Block : po.District;
          const resolvedVillage = po.Name || '';

          if (resolvedState) setState(resolvedState);
          if (resolvedDistrict) setDistrict(resolvedDistrict);
          if (resolvedBlock) setBlock(resolvedBlock);
          if (resolvedVillage) setVillage(resolvedVillage);

          // Background lat/lng fetch via Nominatim
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&postalcode=${code}&country=India&limit=1`,
            { headers: { 'User-Agent': 'JansunwaiAI/1.0' } }
          )
            .then(res => res.json())
            .then(data => {
              if (data && data[0]) {
                const nLat = parseFloat(data[0].lat);
                const nLng = parseFloat(data[0].lon);
                if (!isNaN(nLat) && !isNaN(nLng)) {
                  setLat(nLat);
                  setLng(nLng);
                }
              }
            })
            .catch(() => {});

          setGeoSuccess(`Location resolved: ${resolvedVillage}, ${resolvedDistrict}, ${resolvedState}`);
          setGeoLoading(false);
          return;
        }
      }
    } catch {
      // Fall through to Nominatim
    }

    // 3. Fallback: OpenStreetMap Nominatim
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${code}&country=India&addressdetails=1&limit=1&accept-language=en`,
        { headers: { 'User-Agent': 'JansunwaiAI/1.0' } }
      );
      if (!response.ok) throw new Error('Geocoding service unavailable');
      const data = await response.json();
      if (!data || data.length === 0) throw new Error('No location found for this pincode');

      const result = data[0];
      const addr = result.address || {};

      const newLat = parseFloat(result.lat);
      const newLng = parseFloat(result.lon);
      if (!isNaN(newLat) && !isNaN(newLng)) {
        setLat(newLat);
        setLng(newLng);
      }

      const resolvedState = addr.state || addr.region || '';
      const resolvedDistrict = addr.city || addr.county || addr.state_district || addr.city_district || '';
      const resolvedBlock = addr.suburb || addr.town || addr.municipality || '';
      const resolvedVillage = addr.village || addr.suburb || addr.neighbourhood || addr.residential || resolvedBlock || resolvedDistrict;

      if (resolvedState) setState(resolvedState);
      if (resolvedDistrict) setDistrict(resolvedDistrict);
      if (resolvedBlock) setBlock(resolvedBlock);
      if (resolvedVillage) setVillage(resolvedVillage);

      setGeoSuccess(`Location resolved from pincode ${code}: ${resolvedVillage}, ${resolvedDistrict}, ${resolvedState}`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Pincode lookup failed';
      setGeoError(`Pincode lookup failed: ${errMsg}. Please enter location details manually.`);
    } finally {
      setGeoLoading(false);
    }
  }, []);

  // Geolocation Handler — fetches GPS + triggers reverse geocoding
  const handleManualLocationSelect = async (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    setShowMapModal(false);
    await reverseGeocodeFromCoords(newLat, newLng);
  };

  const handleGetLocation = () => {
    setGeoLoading(true);
    setGeoError(null);
    setGeoSuccess(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          await reverseGeocodeFromCoords(newLat, newLng);
        },
        (err) => {
          console.warn("Geolocation denied or unavailable:", err.message);
          setGeoError("GPS permission denied or unavailable. Please click 'Map Picker' or enter your 6-digit Pincode.");
          setGeoLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser. Please enter your Pincode or use Map Picker.");
      setGeoLoading(false);
    }
  };

  // Handle pincode input with debounced auto-lookup
  const pincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handlePincodeChange = (value: string) => {
    // Only allow digits, max 6
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);
    // Auto-trigger lookup when 6 digits entered
    if (cleaned.length === 6) {
      if (pincodeTimeoutRef.current) clearTimeout(pincodeTimeoutRef.current);
      pincodeTimeoutRef.current = setTimeout(() => {
        geocodeFromPincode(cleaned);
      }, 400);
    }
  };

  // Audio Recording Handlers
  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Map our language names to BCP-47 tags
    const langMap: Record<string, string> = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Bengali': 'bn-IN',
      'Marathi': 'mr-IN',
      'Telugu': 'te-IN',
      'Tamil': 'ta-IN',
      'Gujarati': 'gu-IN',
      'Urdu': 'ur-IN',
      'Odia': 'or-IN',
      'Punjabi': 'pa-IN'
    };

    recognition.lang = langMap[language] || 'hi-IN';
    recognition.continuous = true;
    recognition.interimResults = true;

    transcriptRef.current = description;
    let currentTranscript = description;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingTime(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        currentTranscript = currentTranscript ? currentTranscript + ' ' + finalTranscript : finalTranscript;
        transcriptRef.current = currentTranscript;
        setDescription(currentTranscript);
        // Automatically suggest a title if it's empty
        if (!title && currentTranscript.length > 10) {
          setTitle("Voice Complaint");
        }
      } else if (interimTranscript) {
        // Show interim results live while speaking
        setDescription((currentTranscript ? currentTranscript + ' ' : '') + interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error !== 'no-speech') {
        alert("Microphone error. Please check permissions.");
      }
      stopRecording();
    };

    recognition.onend = () => {
      stopRecording();
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (speechRecognitionRef.current && isRecording) {
      speechRecognitionRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      // Ensure description is synced with final recognized text
      setDescription(transcriptRef.current);
    }
  };

  // AI Assistant trigger
  const handleAiAssist = async (customText?: string) => {
    const textToAnalyze = typeof customText === 'string' ? customText : description;
    if (!textToAnalyze) return;
    setAiLoading(true);
    try {
      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/ai/writing-assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: typeof customText === 'string' ? '' : title,
          description: textToAnalyze,
          language
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiQuestions(data.questions || []);
        setDescription(data.improvedText || textToAnalyze);
        if (data.title) {
          setTitle(data.title);
        }
        setAiScore(data.completenessScore || 70);
      }
    } catch (err) {
      console.error('AI Assist failed:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Answer to AI Clarifying Question
  const handleAnswerQuestion = () => {
    if (!questionAnswer) return;
    const answeredQuestion = aiQuestions[activeQuestionIndex!];
    
    // Append answer to description
    const updatedDesc = `${description}\n\n[AI Clarification Answered]\n- Question: ${answeredQuestion}\n- Answer: ${questionAnswer}`;
    setDescription(updatedDesc);
    
    // Remove answered question and reset input
    const nextQuestions = aiQuestions.filter((_, idx) => idx !== activeQuestionIndex);
    setAiQuestions(nextQuestions);
    setQuestionAnswer('');
    setActiveQuestionIndex(null);

    // Increase simulated completeness score
    if (aiScore !== null) {
      setAiScore(Math.min(100, aiScore + 10));
    }
  };

  // AI Title Generator
  const handleGenerateTitle = async () => {
    if (!description || description.trim().length < 5) {
      alert("Please enter a few words in the Description first so AI can generate an appropriate title.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/ai/writing-assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, category, language })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          setTitle(data.title);
          return;
        }
      }
    } catch (err) {
      console.warn("AI title generation fallback:", err);
    } finally {
      setAiLoading(false);
    }
    // Smart heuristic fallback
    setTitle(`Request for urgent development of ${category} in ${village || district || 'Local Constituency'}`);
  };

  // Submit Initial (opens preview)
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !title) {
      alert("Please fill in Title or Description.");
      return;
    }
    setShowPreview(true);
  };

  // Final Submit Complaint Form
  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowPreview(false);
    setIsSubmitting(true);
    try {
      const effectiveTitle = title.trim() || (description ? description.slice(0, 60) + '...' : 'Citizen Development Complaint');
      const effectiveState = state || 'Uttar Pradesh';
      const effectiveDistrict = district || 'Varanasi';
      const effectiveCitizenId = user?.id || '3683b237-4045-4b54-96ad-ba7b12f8bc13';

      // 1. Duplicate check interceptor (if warning not ignored)
      if (!ignoreDuplicateWarning) {
        const dupRes = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/ai/duplicate-check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: effectiveTitle, description, category, district: effectiveDistrict })
        });
        
        if (dupRes.ok) {
          const dupData = await dupRes.json();
          if (dupData.isDuplicate && dupData.duplicateOfId) {
            setDuplicateFoundInfo({
              id: dupData.duplicateOfId,
              title: dupData.duplicateTitle || effectiveTitle,
              status: dupData.duplicateStatus || 'under_review',
              supportCount: dupData.supportCount || 326,
              similarity: dupData.similarity || 94
            });
            setShowDuplicateModal(true);
            setIsSubmitting(false);
            return;
          }
        }
      }

      // 2. Normal creation if not duplicate (or duplicate ignored)
      const formData = new FormData();
      formData.append('citizen_id', effectiveCitizenId);
      formData.append('title', effectiveTitle);
      formData.append('description', description || effectiveTitle);
      formData.append('category', category);
      formData.append('language', language);
      formData.append('state', effectiveState);
      formData.append('district', effectiveDistrict);
      formData.append('village', village || 'Sigra Ward');
      formData.append('block', block || 'Central Block');
      formData.append('urgency', urgency);
      formData.append('estimated_beneficiaries', beneficiaries || '500');
      
      if (lat) {
        formData.append('location_lat', lat.toString());
      }
      if (lng) {
        formData.append('location_lng', lng.toString());
      }
      
      if (attachments.length > 0) {
        attachments.forEach((att, index) => {
          formData.append(`attachment_${index}`, att.file);
        });
        formData.append('attachmentCount', attachments.length.toString());
      }

      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/suggestions`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitResult({
          success: true,
          isDuplicate: data.isDuplicate,
          duplicateOfId: data.duplicateOfId,
          suggestionId: data.suggestion?.id
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Submission failed.'
        });
      }
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Network submission error.';
      setSubmitResult({
        success: false,
        message: errMsg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportExistingProposal = async () => {
    if (!duplicateFoundInfo || !user) return;
    setIsSupportingFromModal(true);
    try {
      const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/suggestions/${duplicateFoundInfo.id}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        setModalSupportSuccess(true);
        setTimeout(() => {
          setShowDuplicateModal(false);
          router.push('/dashboard');
        }, 3000);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Could not support proposal.');
      }
    } catch (err) {
      console.error('Error supporting proposal:', err);
      alert('Failed to support proposal due to connection issues.');
    } finally {
      setIsSupportingFromModal(false);
    }
  };

  // Circular progress math
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74
  const strokeDashoffset = aiScore !== null ? circumference - (aiScore / 100) * circumference : circumference;

  // Dynamic glow color based on AI score
  const scoreGlowColor = aiScore !== null
    ? aiScore >= 80 ? 'rgba(16,185,129,0.15)' : aiScore >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.12)'
    : 'rgba(99,102,241,0.08)';

  // Dynamic live score calculation (Client-side fallback)
  const completeness = {
    Title: title.trim().length > 3,
    Description: description.trim().length > 10,
    Location: state.trim().length > 0 && district.trim().length > 0,
    Image: attachments.length > 0,
  };

  const calculateScore = () => {
    let score = 10; // base score for default category/urgency
    if (completeness.Title) score += 25;
    if (completeness.Description) score += 35;
    if (completeness.Location) score += 20;
    if (completeness.Image) score += 10;
    return Math.min(100, score);
  };

  const [isScoring, setIsScoring] = useState(false);

  // Real AI Score evaluation via API
  React.useEffect(() => {
    if (!description || description.trim().length < 10) {
      return;
    }
    setIsScoring(true);
    const timer = setTimeout(async () => {
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('state', state);
        formData.append('district', district);
        formData.append('village', village);
        
        const firstImage = attachments.find(a => a.type === 'image');
        if (firstImage) {
          formData.append('image', firstImage.file);
        }

        const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/ai/analyze-suggestion`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data.completenessScore) {
            setAiScore(data.completenessScore);
          }
        }
      } catch (err) {
        console.error('Failed to fetch real AI score', err);
      } finally {
        setIsScoring(false);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timer);
  }, [title, description, state, district, village, attachments]);

  const liveScore = aiScore !== null ? aiScore : calculateScore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* ═══════════ HERO HEADER ═══════════ */}
      <div className="relative p-6 sm:p-8 rounded-[28px] overflow-hidden border border-slate-800/60" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,27,75,0.4) 50%, rgba(15,23,42,0.95) 100%)' }}>
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Gemini 2.5 Flash AI Assisted Proposal Builder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Submit Development Complaint
            </h1>
            <p className="text-xs text-slate-400">Voice-to-text, GIS location verification, and instant AI priority scoring for direct MP intervention.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800/80 p-1.5 rounded-2xl shadow-inner backdrop-blur-md">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-2 pr-1">
              <Mic className="w-3.5 h-3.5 text-indigo-400" />
              Voice:
            </span>
            <div className="flex items-center gap-1">
              {['English', 'Hindi', 'Bengali', 'Marathi'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {lang === 'Hindi' ? 'हिंदी' : lang === 'Bengali' ? 'বাংলা' : lang === 'Marathi' ? 'मराठी' : lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ QUICK-FILL TEMPLATES ═══════════ */}
      <div className="relative rounded-[22px] border border-indigo-500/20 bg-linear-to-r from-slate-900/60 via-indigo-950/20 to-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Proposal Templates (Click to 1-Click Auto-Fill)
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Auto-populates fields for instant testing</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.label}
              type="button"
              onClick={() => {
                setTitle(tmpl.title);
                setDescription(tmpl.description);
                setCategory(tmpl.category);
                setUrgency(tmpl.urgency);
                setBeneficiaries(tmpl.beneficiaries);
                setVillage(tmpl.village);
                setDistrict(tmpl.district);
                setState(tmpl.state);
                if (tmpl.block) setBlock(tmpl.block);
                if (tmpl.pincode) setPincode(tmpl.pincode);
                if (tmpl.lat && tmpl.lng) {
                  setLat(tmpl.lat);
                  setLng(tmpl.lng);
                }
                setGeoSuccess(`Location set: ${tmpl.village}, ${tmpl.district}, ${tmpl.state}`);
              }}
              className="p-3 text-left rounded-xl bg-slate-950/70 hover:bg-indigo-600/10 border border-slate-800/80 hover:border-indigo-500/40 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
                <span className="text-base">{tmpl.icon}</span>
                <span className="truncate group-hover:text-indigo-300 transition-colors">{tmpl.label}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tmpl.title}</p>
              <div className="mt-2 flex items-center gap-2 text-[9px] text-indigo-400/80 font-semibold">
                <span>{tmpl.category}</span>
                <span>•</span>
                <span className="capitalize">{tmpl.urgency} Urgency</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ MAIN FORM AREA ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="relative rounded-[24px] border border-slate-800/60 overflow-hidden bg-slate-900/40 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />
            
            <form onSubmit={handleSubmitForm} className="p-6 sm:p-7 space-y-6">

              {/* Title field with AI badge & Auto-Generate button */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Hash className="w-3.5 h-3.5 text-indigo-400" />
                    Complaint Title
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateTitle}
                      disabled={aiLoading}
                      className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      title="Use AI to generate a crisp formal title from description"
                    >
                      <Wand2 className="w-3 h-3 text-indigo-400" />
                      Auto-Generate Title
                    </button>
                    {title && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Ready
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="AI will generate a formal title, or type your own..."
                    className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl py-4 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Development Category Picker: Clean Visual Cards + Other selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Development Category
                  </label>
                  <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                    {category}
                  </span>
                </div>

                {/* Popular Category Interactive Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {POPULAR_CATEGORIES.map((cat) => {
                    const isSelected = category === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-linear-to-b from-indigo-600 to-indigo-700 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 scale-[1.02] ring-1 ring-indigo-400/50'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/50'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-[11px] font-bold leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Clean inline dropdown for additional 15+ categories */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">More Categories:</span>
                  <div className="relative flex-1">
                    <select
                      value={POPULAR_CATEGORIES.some(c => c.name === category) ? '' : category}
                      onChange={(e) => {
                        if (e.target.value) setCategory(e.target.value);
                      }}
                      className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 pl-3 pr-8 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Browse 15+ additional sectors (Environment, Women Safety, etc.)...</option>
                      {CATEGORIES.filter(c => !POPULAR_CATEGORIES.some(pc => pc.name === c)).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Description with AI writing assist overlay */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    Description
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAiAssist()}
                      disabled={aiLoading || !description}
                      className="text-[11px] font-bold text-violet-300 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                      title="AI transforms your notes into an official letter to the MP"
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3 text-violet-400" />}
                      <span>{aiLoading ? 'Enhancing with AI...' : '✨ AI Formalize Proposal'}</span>
                    </button>
                    <span className="text-[10px] text-slate-500 font-medium">{description.length} chars</span>
                  </div>
                </div>

                {isRecording && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-red-400 text-xs animate-pulse">
                    <span className="flex items-center gap-2 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      Listening in {language}... Speak clearly.
                    </span>
                    <span className="font-mono font-bold text-white bg-red-600/80 px-2 py-0.5 rounded-md">{recordingTime}s</span>
                  </div>
                )}

                <div className="relative group">
                  <textarea
                    required
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the developmental need in detail. AI will rewrite it into a formal application letter addressed to your MP..."
                    className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl py-4 px-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 focus:shadow-[0_0_20px_rgba(99,102,241,0.06)] transition-all duration-300 font-sans resize-none"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`relative flex items-center justify-center p-3 rounded-xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
                        isRecording 
                          ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30' 
                          : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 hover:-translate-y-0.5'
                      }`}
                      title={isRecording ? "Stop Recording" : `Voice Typing in ${language}`}
                    >
                      {isRecording && (
                        <div className="absolute inset-0 bg-red-400/30 animate-ping rounded-xl" />
                      )}
                      <div className="relative z-10 flex items-center gap-2">
                        {isRecording ? (
                          <>
                            <span className="w-4 h-4 rounded-sm bg-white animate-pulse" />
                            <span className="text-white text-xs font-bold w-6 text-center">{recordingTime}s</span>
                          </>
                        ) : (
                          <Mic className="w-4.5 h-4.5 text-white group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                    </button>
                    {description.length > 5 && (
                      <button
                        type="button"
                        onClick={() => handleAiAssist()}
                        disabled={aiLoading}
                        className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white text-[11px] px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all font-bold cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Formalizing...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>AI Letter Writer</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Urgency Selector: 4-Segment Visual Priority Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Urgency Level
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Select based on public hazard & necessity</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'low', label: 'Routine', badge: '🟢 Low', desc: 'Planned improvement' },
                    { id: 'medium', label: 'Important', badge: '🟡 Medium', desc: 'Active community need' },
                    { id: 'high', label: 'High Priority', badge: '🟠 High', desc: 'Immediate MP action' },
                    { id: 'critical', label: 'Hazard', badge: '🔴 Critical', desc: 'Severe safety emergency' },
                  ].map((u) => {
                    const isSelected = urgency === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUrgency(u.id)}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? u.id === 'critical'
                              ? 'bg-rose-950/50 border-rose-500 text-white shadow-lg shadow-rose-500/20 ring-1 ring-rose-500'
                              : u.id === 'high'
                              ? 'bg-amber-950/50 border-amber-500 text-white shadow-lg shadow-amber-500/20 ring-1 ring-amber-500'
                              : u.id === 'medium'
                              ? 'bg-yellow-950/40 border-yellow-500/80 text-white shadow-lg shadow-yellow-500/15 ring-1 ring-yellow-500/60'
                              : 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-500/60'
                            : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{u.badge}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">{u.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── EVIDENCE HUB ── */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    Evidence & Media
                  </label>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">{attachments.length} attached</span>
                </div>

                {attachments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-950/20 border border-slate-800/40 rounded-2xl p-4">
                    {/* Column 1: Compact Upload Area */}
                    <div className="md:col-span-2 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/40 pb-4 md:pb-0 md:pr-4">
                      <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Add More Files</span>
                        <label className="flex flex-col items-center justify-center p-3 bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/30 rounded-xl cursor-pointer transition-all group hover:bg-indigo-500/10 active:scale-[0.98] text-center">
                          <Paperclip className="w-5 h-5 text-indigo-400 mb-1" />
                          <span className="text-[10px] font-bold text-indigo-300">Browse Files</span>
                          <input 
                            type="file" 
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx" 
                            multiple 
                            className="hidden" 
                            onChange={handleFileChange} 
                          />
                        </label>
                      </div>

                      {/* Attachment Previews */}
                      <div className="mt-3">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Attached Files</span>
                        <div className="flex overflow-x-auto pb-1 gap-2.5 snap-x scrollbar-none">
                          {attachments.map((att) => (
                            <div key={att.id} className="relative flex-none w-20 bg-slate-900/60 border border-slate-800/60 rounded-xl p-1.5 snap-center group shadow-sm hover:border-slate-700 transition-all">
                              <div className="h-11 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800/60 mb-1 relative">
                                {att.type === 'image' && <img src={att.preview} alt="preview" className="w-full h-full object-cover" />}
                                {att.type === 'video' && (
                                  <>
                                    <video src={att.preview} className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center"><FilePlay className="w-4 h-4 text-white/80" /></div>
                                  </>
                                )}
                                {att.type === 'audio' && <FileAudio className="w-5 h-5 text-amber-500" />}
                                {att.type === 'document' && <FileDown className="w-5 h-5 text-emerald-500" />}
                              </div>
                              <div className="truncate text-[8px] font-semibold text-slate-350 px-0.5 block" title={att.file.name}>{att.file.name}</div>
                              <button 
                                type="button" 
                                onClick={() => removeAttachment(att.id)} 
                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: AI analysis diagnostics */}
                    <div className="md:col-span-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isAnalyzingImage ? 'animate-spin' : ''}`} />
                          <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">AI Verification Engine</span>
                        </div>
                        {isAnalyzingImage && <span className="text-[8px] text-indigo-400 animate-pulse font-bold tracking-widest uppercase">Processing Vision...</span>}
                      </div>

                      {isAnalyzingImage ? (
                        <div className="flex-1 flex items-center justify-center py-6 text-slate-500 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                          Running diagnostics...
                        </div>
                      ) : imageAnalysis ? (
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex flex-col justify-between">
                            <span className="text-[7.5px] uppercase tracking-widest text-slate-500 font-bold">Detected issue</span>
                            <span className="text-white mt-0.5 flex items-center gap-1 truncate"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> {imageAnalysis.detected}</span>
                          </div>
                          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex flex-col justify-between">
                            <span className="text-[7.5px] uppercase tracking-widest text-slate-500 font-bold">Confidence</span>
                            <span className="text-indigo-400 block mt-0.5">{imageAnalysis.confidence}</span>
                          </div>
                          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex flex-col justify-between">
                            <span className="text-[7.5px] uppercase tracking-widest text-slate-500 font-bold">Severity level</span>
                            <span className={`block mt-0.5 ${imageAnalysis.severity?.toLowerCase() === 'critical' ? 'text-rose-500' : imageAnalysis.severity?.toLowerCase() === 'high' ? 'text-amber-500' : 'text-emerald-500'}`}>{imageAnalysis.severity}</span>
                          </div>
                          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex flex-col justify-between">
                            <span className="text-[7.5px] uppercase tracking-widest text-slate-500 font-bold">Valuation index</span>
                            <span className="text-slate-350 block mt-0.5 truncate">{imageAnalysis.estimatedValue}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 bg-slate-950/40 border border-slate-900 p-3 rounded-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">No image uploaded</span>
                            <p className="text-[9px] text-slate-450 leading-normal">
                              AI vision scanning automatically runs duplicate checks and severity evaluation on first attached photo.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <label 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center py-9 px-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
                        isDragging 
                          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-xl shadow-indigo-500/10' 
                          : 'border-slate-800 bg-slate-950/50 hover:border-indigo-500/50 hover:bg-indigo-950/10'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3.5 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all shadow-inner">
                        <Paperclip className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                        Upload Photos, Videos or Documents
                      </span>
                      <p className="text-[11px] text-slate-400 text-center max-w-sm mb-3">
                        Drag and drop files here, or <span className="text-indigo-400 font-bold underline">browse</span> from your phone/device.
                      </p>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">JPG / PNG</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">MP4 Video</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">Audio Voice</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">PDF Document</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx" 
                        multiple 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </label>
                    
                    {/* Default Prompt block when empty */}
                    <div className="mt-3 p-3.5 rounded-xl border border-indigo-500/20 bg-slate-900/40 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-indigo-500 to-purple-500" />
                      <div className="flex items-center gap-2 mb-2 ml-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[11px] font-bold text-slate-300">AI will analyze uploaded media</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-1">
                        {['Road Damage', 'Water Logging', 'Garbage', 'School Building', 'Hospital'].map((item) => (
                          <span key={item} className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" />
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 ml-1 text-[9px] text-slate-550 font-medium tracking-wide uppercase">Detected automatically</div>
                    </div>
                  </>
                )}
              </div>

              {/* ── LOCATION SECTION ── */}
              <div className="space-y-4 pt-4 border-t border-slate-800/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Location Intelligence
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMapModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-slate-300 rounded-xl text-[11px] font-bold transition-all cursor-pointer hover:border-slate-700"
                    >
                      <MapIcon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Map Picker</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={geoLoading}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/8 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-xl text-[11px] font-bold transition-all shadow-sm hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                    >
                      {geoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                      <span>{geoLoading ? 'Resolving...' : 'Auto-Detect GPS'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick 1-Click Locations */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick Locations:</span>
                  {[
                    { label: 'Gomti Nagar (Lucknow)', village: 'Gomti Nagar', block: 'Lucknow East', district: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010', lat: 26.8500, lng: 80.9900 },
                    { label: 'Hazratganj (Lucknow)', village: 'Hazratganj', block: 'Lucknow Central', district: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', lat: 26.8467, lng: 80.9462 },
                    { label: 'Indira Nagar (Lucknow)', village: 'Indira Nagar', block: 'Indira Nagar', district: 'Lucknow', state: 'Uttar Pradesh', pincode: '226016', lat: 26.8800, lng: 80.9800 },
                    { label: 'Sigra Ward (Varanasi)', village: 'Sigra Ward', block: 'Varanasi City', district: 'Varanasi', state: 'Uttar Pradesh', pincode: '221002', lat: 25.3191, lng: 82.9754 },
                    { label: 'Cantonment (Varanasi)', village: 'Cantonment', block: 'Varanasi City', district: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001', lat: 25.3176, lng: 82.9739 },
                  ].map((loc) => (
                    <button
                      key={loc.label}
                      type="button"
                      onClick={() => {
                        setVillage(loc.village);
                        setBlock(loc.block);
                        setDistrict(loc.district);
                        setState(loc.state);
                        setPincode(loc.pincode);
                        setLat(loc.lat);
                        setLng(loc.lng);
                        setGeoSuccess(`Location set: ${loc.village}, ${loc.district}`);
                      }}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-950/60 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-300 transition-all cursor-pointer"
                    >
                      📍 {loc.label}
                    </button>
                  ))}
                </div>

                {/* Pincode */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pincode (auto-fill location)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="Enter 6-digit pincode to auto-fill location"
                      className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl py-3.5 pl-11 pr-24 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-300"
                    />
                    {pincode.length === 6 && (
                      <button
                        type="button"
                        onClick={() => geocodeFromPincode(pincode)}
                        disabled={geoLoading}
                        className="absolute inset-y-0 right-0 pr-2 flex items-center"
                      >
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer">
                          {geoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                          <span>Lookup</span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status banners */}
                {geoLoading && (
                  <div className="flex items-center gap-3 p-3.5 bg-indigo-500/5 border border-indigo-500/15 rounded-xl text-indigo-400 text-[11px] animate-fadeIn">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span className="font-medium">Resolving location from {pincode.length === 6 ? `pincode ${pincode}` : 'GPS coordinates'}...</span>
                  </div>
                )}
                {geoSuccess && !geoLoading && (
                  <div className="flex items-center gap-2 p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-emerald-400 text-[11px] animate-fadeIn">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{geoSuccess}</span>
                  </div>
                )}
                {geoError && !geoLoading && (
                  <div className="flex items-center gap-2 p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-[11px] animate-fadeIn">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{geoError}</span>
                  </div>
                )}
                {lat && lng && !geoLoading && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-xl text-emerald-400 text-[11px] flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">GPS Verified: <span className="font-bold text-white ml-1">{lat.toFixed(5)}, {lng.toFixed(5)}</span></span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-md font-bold">GIS Locked</span>
                  </div>
                )}

                {/* Location fields grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'State', value: state, setter: setState, icon: MapPin, placeholder: 'Auto-filled from pincode/GPS' },
                    { label: 'District', value: district, setter: setDistrict, icon: MapIcon, placeholder: 'Auto-filled from pincode/GPS' },
                    { label: 'Block Name', value: block, setter: setBlock, icon: Info, placeholder: 'Auto-filled or enter manually', required: false },
                    { label: 'Village / Ward', value: village, setter: setVillage, icon: MapPin, placeholder: 'Auto-filled or enter manually', required: false },
                  ].map(({ label, value, setter, icon: LocIcon, placeholder, required: req }) => (
                    <div key={label}>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                          <LocIcon className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required={req !== false}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          placeholder={placeholder}
                          className={`w-full bg-slate-950/70 border rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-300 ${geoSuccess && value ? 'border-emerald-500/30' : 'border-slate-800/80'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SUBMIT BUTTON ── */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 disabled:opacity-50 text-white py-5 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-600/25 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {/* Shimmer sweep effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                  
                  {isSubmitting ? (
                    <span className="flex items-center gap-2.5 animate-pulse relative z-10">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Registering proposal & running AI verification...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2.5 relative z-10">
                      <Send className="w-5 h-5" />
                      <span>Register Development Complaint</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: AI Completeness Score */}
        <div className="sticky top-6 space-y-6">
          <div className="relative rounded-[24px] border border-slate-800/60 overflow-hidden bg-slate-900/40 backdrop-blur-sm p-6 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />
            
            <h3 className="text-sm font-bold text-white mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Proposal Quality
              </span>
              {isScoring && (
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI Evaluating
                </span>
              )}
            </h3>
            
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-800" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    className={`${liveScore >= 80 ? 'stroke-emerald-400' : liveScore >= 50 ? 'stroke-amber-400' : 'stroke-rose-400'} transition-all duration-1000 ease-out`} 
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 - (liveScore / 100) * (2 * Math.PI * 45)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
                  <span className="text-3xl font-black text-white">{liveScore}<span className="text-sm text-slate-400">%</span></span>
                </div>
              </div>
            </div>

            {/* Estimated Priority Badge */}
            <div className="mb-6 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Estimated Priority Rating</span>
              <div className="flex items-center justify-center gap-1.5">
                {liveScore >= 75 ? (
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> High (Fast-Track for MP Plan)
                  </span>
                ) : liveScore >= 45 ? (
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Medium (Standard Review)
                  </span>
                ) : (
                  <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Incomplete (Fill Details)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Completed items */}
              <div className="space-y-2">
                {Object.entries(completeness).map(([key, isComplete]) => {
                  if (!isComplete) return null;
                  const labelMap: Record<string, string> = {
                    Title: 'Clear Title Added',
                    Description: 'Comprehensive Details',
                    Location: 'GIS Location Verified',
                    Image: 'Evidence Media Attached'
                  };
                  return (
                    <div key={key} className="flex items-center justify-between text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 transition-all duration-300">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{labelMap[key] || key}</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-500">Verified</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Missing items */}
              {Object.values(completeness).includes(false) && (
                <>
                  <div className="h-px w-full bg-slate-800/80 my-2" />
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-2.5">
                      To Increase Priority Score:
                    </span>
                    <div className="space-y-2">
                      {Object.entries(completeness).map(([key, isComplete]) => {
                        if (isComplete) return null;
                        const tipMap: Record<string, { label: string; boost: string }> = {
                          Title: { label: 'Add a descriptive title', boost: '+25%' },
                          Description: { label: 'Describe the issue (>10 chars)', boost: '+35%' },
                          Location: { label: 'Select or detect location', boost: '+20%' },
                          Image: { label: 'Attach photo/evidence', boost: '+10%' }
                        };
                        const tip = tipMap[key] || { label: key, boost: '+10%' };
                        return (
                          <div key={key} className="flex items-center justify-between text-xs font-medium text-slate-400 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800/80 transition-all">
                            <span className="flex items-center gap-2">
                              <XCircle className="w-3.5 h-3.5 text-rose-400/70 shrink-0" />
                              <span>{tip.label}</span>
                            </span>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                              {tip.boost}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-8 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium leading-relaxed">
              <div className="flex gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>AI live updates the score as you fill in details. Aim for &gt;80% for high priority.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ PREVIEW MODAL ═══════════ */}
      {showPreview && !submitResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
          <div className="relative w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Preview Your Proposal
              </h3>
              <button type="button" onClick={() => !isSubmitting && setShowPreview(false)} disabled={isSubmitting} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Title</label>
                  <p className="text-sm text-slate-200 font-medium bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">{title}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Description</label>
                  <p className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 whitespace-pre-wrap leading-relaxed">{description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Location</label>
                    <p className="text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">{village ? village + ', ' : ''}{district ? district + ', ' : ''}{state}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Urgency</label>
                    <p className="text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50 capitalize">{urgency}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">AI Impact Analysis</label>
                    <p className="text-xs text-indigo-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">Auto-calculated by AI</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Attachments</label>
                    <p className="text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">{attachments.length} files attached</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-800/60">
                <button type="button" onClick={() => setShowPreview(false)} disabled={isSubmitting} className="grow py-3.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-850 hover:bg-slate-805 transition-colors disabled:opacity-50">
                  Edit Details
                </button>
                <button type="button" onClick={handleSubmitForm} disabled={isSubmitting} className="grow py-3.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ SUCCESS MODAL ═══════════ */}
      {submitResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Animated Backdrop */}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl animate-fadeIn" />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md animate-fadeIn transition-all">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 via-indigo-500 to-violet-500 rounded-[32px] blur-xl opacity-30" />
            
            <div className="relative bg-[#0b0f19] border border-white/8 rounded-[32px] p-8 sm:p-10 text-center shadow-2xl overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-linear-to-r from-emerald-400 via-indigo-400 to-violet-400" />
              
              {/* Subtle glass texture */}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_100%)] pointer-events-none" />

              {submitResult.success ? (
                <div className="relative z-10 flex flex-col items-center">
                  {/* Floating Icon */}
                  <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 rounded-[2.5rem] bg-linear-to-br from-emerald-400/20 to-emerald-900/40 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] transform hover:-translate-y-2 transition-transform duration-500">
                      <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-tr from-emerald-400/10 to-transparent opacity-50" />
                      <CheckCircle className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="space-y-3 mb-8">
                    <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-slate-400 tracking-tight drop-shadow-sm">
                      Proposal Registered!
                    </h3>
                    <p className="text-[13px] text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                      Your complaint has been logged on the constituency map. <span className="text-emerald-400 font-medium">AI verification complete.</span>
                    </p>
                  </div>

                  {submitResult.isDuplicate && (
                    <div className="w-full bg-[#13182b]/80 p-5 rounded-2xl border border-amber-500/30 shadow-inner mb-8 transition-colors">
                      <div className="flex flex-col space-y-2 text-left">
                        <span className="font-bold text-amber-400 flex items-center gap-2 text-xs">
                          <AlertTriangle className="w-4 h-4" />
                          Duplicate Match Detected
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          This development request has already been supported by others. Your request is linked to ensure group impact.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={() => router.push(`/dashboard/suggestions/${submitResult.suggestionId || 'recent'}`)}
                      className="group relative w-full overflow-hidden rounded-2xl p-[1.5px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-[spin_4s_linear_infinite] opacity-70" />
                      <div className="relative flex items-center justify-center gap-2.5 bg-[#0b0f19] group-hover:bg-linear-to-r group-hover:from-indigo-600/10 group-hover:to-purple-600/10 px-6 py-4 rounded-[14.5px] transition-colors">
                        <span className="font-bold text-sm text-transparent bg-clip-text bg-linear-to-r from-indigo-300 to-purple-300">Track Complaint Timeline</span>
                        <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl text-sm transition-colors border border-slate-700 shadow-lg"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center">
                  {/* Failure State */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 rounded-[2.5rem] bg-linear-to-br from-rose-400/20 to-rose-900/40 border border-rose-500/30 flex items-center justify-center">
                      <XCircle className="w-12 h-12 text-rose-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Submission Failed</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed mb-8">{submitResult.message}</p>
                  
                  <button
                    onClick={() => setSubmitResult(null)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl text-sm transition-colors border border-slate-700 shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MAP MODAL ═══════════ */}
      {showMapModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900/95 border border-slate-800/80 rounded-[28px] max-w-3xl w-full p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-emerald-400" />
                <span>Select Location on Map</span>
              </h3>
              <button type="button" onClick={() => setShowMapModal(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 hover:bg-slate-800 rounded-lg">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <MapPicker initialLat={lat || (district?.toLowerCase().includes('lucknow') ? 26.8467 : 25.3176)} initialLng={lng || (district?.toLowerCase().includes('lucknow') ? 80.9462 : 82.9739)} onLocationSelect={handleManualLocationSelect} />
          </div>
        </div>
      )}

      {/* ═══════════ SIMILAR PROPOSAL MODAL ═══════════ */}
      {showDuplicateModal && duplicateFoundInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl animate-fadeIn" />
          
          <div className="relative w-full max-w-xl animate-fadeIn">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-linear-to-r from-amber-500 via-indigo-500 to-violet-500 rounded-[32px] blur-xl opacity-30" />
            
            <div className="relative bg-[#0b0f19] border border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-linear-to-r from-amber-400 to-indigo-500" />
              
              {modalSupportSuccess ? (
                <div className="py-6 flex flex-col items-center space-y-4">
                  <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Thank you!</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                    You have successfully supported this proposal. Redirecting to your dashboard...
                  </p>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                  <div className="flex items-center space-x-3 text-indigo-400 font-bold border-b border-slate-800/80 pb-4">
                    <Sparkles className="w-5 h-5 animate-pulse text-indigo-400" />
                    <h3 className="text-md font-black text-white">🤖 AI Recommendation</h3>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-medium">We found a similar development proposal in your constituency:</p>
                    <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-5 space-y-4">
                      <h4 className="text-sm font-black text-slate-100 leading-snug">{duplicateFoundInfo.title}</h4>
                      
                      <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-xs">
                        <span className="text-slate-400 font-semibold">👍 Supported by <strong className="text-white">{duplicateFoundInfo.supportCount}</strong> citizens</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          AI Similarity {duplicateFoundInfo.similarity || 94}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Supporting this proposal will strengthen the public demand and help the MP prioritize it faster.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={handleSupportExistingProposal}
                      disabled={isSupportingFromModal}
                      className="w-full sm:flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      {isSupportingFromModal ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Support Existing Proposal
                    </button>
                    
                    <button
                      onClick={() => window.open(`/dashboard/suggestions/${duplicateFoundInfo.id}`, '_blank')}
                      className="w-full sm:w-auto py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-all border border-slate-850 cursor-pointer"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => {
                        setIgnoreDuplicateWarning(true);
                        setShowDuplicateModal(false);
                        setTimeout(() => {
                          handleSubmitForm();
                        }, 50);
                      }}
                      className="w-full sm:w-auto py-3.5 px-4 text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors cursor-pointer text-center"
                    >
                      Create New Proposal Anyway
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
          
