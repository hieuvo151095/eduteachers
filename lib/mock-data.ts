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

// Mock classes
export const MOCK_CLASSES: ClassInfo[] = [
  { id: 'class-1', name: 'Lớp 6A2' },
  { id: 'class-2', name: '8A1' },
  { id: 'class-3', name: '8A2' },
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

// Mock food menus for each class
export const MOCK_FOOD_MENUS: Record<string, FoodMenu> = {
  'class-1': {
    // Lớp 6A2
    date: '30/06/2026',
    timeSections: [
      {
        period: 'Buổi sáng',
        foods: [
          {
            id: 'food-1',
            name: 'Cháo gà',
            ingredients: MOCK_INGREDIENTS['cháo gà'],
          },
          {
            id: 'food-2',
            name: 'Bánh mì',
            ingredients: MOCK_INGREDIENTS['bánh mì'],
          },
          {
            id: 'food-3',
            name: 'Sữa tươi',
            ingredients: MOCK_INGREDIENTS['sữa tươi'],
          },
        ],
      },
      {
        period: 'Buổi trưa',
        foods: [
          {
            id: 'food-4',
            name: 'Cơm trắng',
            ingredients: MOCK_INGREDIENTS['cơm trắng'],
          },
          {
            id: 'food-5',
            name: 'Canh cá',
            ingredients: MOCK_INGREDIENTS['canh cá'],
          },
          {
            id: 'food-6',
            name: 'Rau muống xào',
            ingredients: MOCK_INGREDIENTS['rau muống xào'],
          },
        ],
      },
      {
        period: 'Buổi xế',
        foods: [
          {
            id: 'food-7',
            name: 'Trứng cuộn',
            ingredients: MOCK_INGREDIENTS['trứng cuộn'],
          },
          {
            id: 'food-8',
            name: 'Trái cây tươi',
            ingredients: MOCK_INGREDIENTS['trái cây tươi'],
          },
        ],
      },
    ],
  },
  'class-2': {
    // 8A1
    date: '30/06/2026',
    timeSections: [
      {
        period: 'Buổi sáng',
        foods: [
          {
            id: 'food-9',
            name: 'Cơm trắng',
            ingredients: MOCK_INGREDIENTS['cơm trắng'],
          },
          {
            id: 'food-10',
            name: 'Trứng cuộn',
            ingredients: MOCK_INGREDIENTS['trứng cuộn'],
          },
        ],
      },
      {
        period: 'Buổi trưa',
        foods: [
          {
            id: 'food-11',
            name: 'Cháo gà',
            ingredients: MOCK_INGREDIENTS['cháo gà'],
          },
          {
            id: 'food-12',
            name: 'Rau muống xào',
            ingredients: MOCK_INGREDIENTS['rau muống xào'],
          },
        ],
      },
    ],
  },
  'class-3': {
    // 8A2
    date: '30/06/2026',
    timeSections: [
      {
        period: 'Buổi sáng',
        foods: [
          {
            id: 'food-13',
            name: 'Bánh mì',
            ingredients: MOCK_INGREDIENTS['bánh mì'],
          },
          {
            id: 'food-14',
            name: 'Sữa tươi',
            ingredients: MOCK_INGREDIENTS['sữa tươi'],
          },
        ],
      },
      {
        period: 'Buổi trưa',
        foods: [
          {
            id: 'food-15',
            name: 'Canh cá',
            ingredients: MOCK_INGREDIENTS['canh cá'],
          },
          {
            id: 'food-16',
            name: 'Cơm trắng',
            ingredients: MOCK_INGREDIENTS['cơm trắng'],
          },
        ],
      },
      {
        period: 'Buổi xế',
        foods: [
          {
            id: 'food-17',
            name: 'Trái cây tươi',
            ingredients: MOCK_INGREDIENTS['trái cây tươi'],
          },
        ],
      },
    ],
  },
}
