export interface Trace {
  id: string;
  date: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  likes: number;
  comments: number;
  category: 'فكرة' | 'اقتباس' | 'تجربة' | 'نصيحة';
  createdAt: number;
}

export const mockTraces: Trace[] = [
  {
    id: '1',
    date: '2025-01-28',
    title: 'بداية جديدة',
    content: 'كل يوم هو فرصة جديدة لتكون أفضل من الأمس. لا تدع الماضي يعيقك عن المستقبل.',
    author: 'أحمد محمد',
    likes: 42,
    comments: 8,
    category: 'فكرة',
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    date: '2025-01-27',
    title: 'قوة الإرادة',
    content: 'النجاح ليس نهاية الطريق، والفشل ليس نهاية العالم. الشجاعة للاستمرار هي ما يهم.',
    author: 'سارة أحمد',
    likes: 67,
    comments: 12,
    category: 'اقتباس',
    createdAt: Date.now() - 86400000,
  },
  {
    id: '3',
    date: '2025-01-26',
    title: 'تجربة القراءة',
    content: 'بدأت بقراءة كتاب يوميًا لمدة 30 دقيقة. التغيير في تفكيري وإنتاجيتي كان مذهلاً!',
    author: 'محمد علي',
    likes: 89,
    comments: 15,
    category: 'تجربة',
    createdAt: Date.now() - 172800000,
  },
  {
    id: '4',
    date: '2025-01-25',
    title: 'نصيحة للنجاح',
    content: 'ابدأ صغيرًا، لكن ابدأ الآن. التقدم البطيء أفضل من عدم التقدم على الإطلاق.',
    author: 'فاطمة حسن',
    likes: 54,
    comments: 9,
    category: 'نصيحة',
    createdAt: Date.now() - 259200000,
  },
];