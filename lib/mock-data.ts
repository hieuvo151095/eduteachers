export interface Ingredient {
  id: string
  name: string
  gtin?: string
  soLo?: string
  maTem?: string
  company: string
  datChuanStatus: 'đạt' | 'không đạt'
}

export interface FoodItem {
  id: string
  name: string
  ingredients: Ingredient[]
}

export interface TimeSection {
  period: 'Buổi sáng' | 'Buổi trưa' | 'Buổi xế'
  foods: FoodItem[]
}

export interface FoodMenu {
  date: string
  timeSections: TimeSection[]
}

export interface ClassInfo {
  id: string
  name: string
}

// Mock classes - organized in rows of 3
export const MOCK_CLASSES: ClassInfo[] = [
  { id: 'class-1', name: 'Lớp Mầm' },
  { id: 'class-2', name: 'Lớp Chòi' },
  { id: 'class-3', name: 'Lớp Lá' },
  { id: 'class-4', name: 'Lớp 1A' },
  { id: 'class-5', name: 'Lớp 1B' },
  { id: 'class-6', name: 'Lớp 2A' },
  { id: 'class-7', name: 'Lớp 6A2' },
  { id: 'class-8', name: '8A1' },
  { id: 'class-9', name: '8A2' },
]

// Mock ingredients data
const MOCK_INGREDIENTS: Record<string, Ingredient[]> = {
  'cháo gà': [
    {
      id: 'ing-1',
      name: 'Gạo tấm',
      gtin: '859358645823',
      soLo: '202643-65',
      company: 'Công ty CP Lương thực Sài Gòn',
      datChuanStatus: 'đạt',
    },
    {
      id: 'ing-2',
      name: 'Gà tươi',
      maTem: 'G592852526',
      company: 'Trang trại gà Mỹ Hào',
      datChuanStatus: 'đạt',
    },
  ],
  'trứng cuộn': [
    {
      id: 'ing-3',
      name: 'Trứng gà tươi',
      gtin: '815926384756',
      soLo: '210756-42',
      company: 'Trại gà Lương Minh',
      datChuanStatus: 'đạt',
    },
  ],
  'cơm trắng': [
    {
      id: 'ing-4',
      name: 'Gạo lúa ngon',
      gtin: '948273615928',
      soLo: '215843-78',
      company: 'Công ty CP Lương thực Sài Gòn',
      datChuanStatus: 'đạt',
    },
  ],
  'rau muống xào': [
    {
      id: 'ing-5',
      name: 'Rau muống tươi',
      maTem: 'V128375926',
      company: 'Vườn rau Bình Minh',
      datChuanStatus: 'đạt',
    },
  ],
  'canh cá': [
    {
      id: 'ing-6',
      name: 'Cá diếc',
      gtin: '756293847561',
      soLo: '220134-51',
      company: 'Chợ cá Nha Trang',
      datChuanStatus: 'đạt',
    },
  ],
  'bánh mì': [
    {
      id: 'ing-7',
      name: 'Bột mì mịn',
      gtin: '384756928374',
      soLo: '208765-33',
      company: 'Nhà máy bột mì Bình Dương',
      datChuanStatus: 'đạt',
    },
  ],
  'sữa tươi': [
    {
      id: 'ing-8',
      name: 'Sữa bò tươi',
      gtin: '657483920156',
      soLo: '218765-64',
      company: 'Công ty sữa Vinamilk',
      datChuanStatus: 'đạt',
    },
  ],
  'trái cây tươi': [
    {
      id: 'ing-9',
      name: 'Chuối tươi',
      maTem: 'F745839201',
      company: 'Trang trại Trái cây Bến Tre',
      datChuanStatus: 'đạt',
    },
  ],
}

// Helper function to generate menu for all classes and dates
const generateMenuForDate = (offset: number): FoodMenu => ({
  date: new Date(2026, 5, 30 + offset).toLocaleDateString('vi-VN'),
  timeSections: [
    {
      period: 'Buổi sáng',
      foods: [
        {
          id: `food-${offset}-1`,
          name: offset % 2 === 0 ? 'Cháo gà' : 'Bánh mì',
          ingredients: offset % 2 === 0 ? MOCK_INGREDIENTS['cháo gà'] : MOCK_INGREDIENTS['bánh mì'],
        },
        {
          id: `food-${offset}-2`,
          name: offset % 3 === 0 ? 'Sữa tươi' : 'Bánh mì',
          ingredients: offset % 3 === 0 ? MOCK_INGREDIENTS['sữa tươi'] : MOCK_INGREDIENTS['bánh mì'],
        },
      ],
    },
    {
      period: 'Buổi trưa',
      foods: [
        {
          id: `food-${offset}-3`,
          name: 'Cơm trắng',
          ingredients: MOCK_INGREDIENTS['cơm trắng'],
        },
        {
          id: `food-${offset}-4`,
          name: offset % 2 === 0 ? 'Canh cá' : 'Rau muống xào',
          ingredients: offset % 2 === 0 ? MOCK_INGREDIENTS['canh cá'] : MOCK_INGREDIENTS['rau muống xào'],
        },
        {
          id: `food-${offset}-5`,
          name: offset % 3 === 0 ? 'Trứng cuộn' : 'Rau muống xào',
          ingredients: offset % 3 === 0 ? MOCK_INGREDIENTS['trứng cuộn'] : MOCK_INGREDIENTS['rau muống xào'],
        },
      ],
    },
    {
      period: 'Buổi xế',
      foods: [
        {
          id: `food-${offset}-6`,
          name: 'Trái cây tươi',
          ingredients: MOCK_INGREDIENTS['trái cây tươi'],
        },
      ],
    },
  ],
})

// Generate menus for all dates and classes
export const MOCK_FOOD_MENUS: Record<string, Record<string, FoodMenu>> = {
  'class-1': {
    // Lớp Mầm
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i - 7),
      ])
    ),
  },
  'class-2': {
    // Lớp Chòi
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i - 6),
      ])
    ),
  },
  'class-3': {
    // Lớp Lá
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i - 5),
      ])
    ),
  },
  'class-4': {
    // Lớp 1A
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i - 4),
      ])
    ),
  },
  'class-5': {
    // Lớp 1B
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i - 3),
      ])
    ),
  },
  'class-6': {
    // Lớp 2A
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i - 2),
      ])
    ),
  },
  'class-7': {
    // Lớp 6A2
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i - 1),
      ])
    ),
  },
  'class-8': {
    // 8A1
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i),
      ])
    ),
  },
  'class-9': {
    // 8A2
    ...Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [
        new Date(2026, 5, 30 + (i - 7)).toLocaleDateString('vi-VN'),
        generateMenuForDate(i + 1),
      ])
    ),
  },
}
