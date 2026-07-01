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
  isHomeroom?: boolean
}

// 9 classes — 3 per row in class switcher
export const MOCK_CLASSES: ClassInfo[] = [
  { id: 'class-1', name: 'Lớp Mầm' },
  { id: 'class-2', name: 'Lớp Chòi' },
  { id: 'class-3', name: 'Lớp Lá' },
  { id: 'class-4', name: 'Lớp 1A' },
  { id: 'class-5', name: 'Lớp 1B' },
  { id: 'class-6', name: 'Lớp 2A' },
  { id: 'class-7', name: 'Lớp 6A2', isHomeroom: true },
  { id: 'class-8', name: '8A1' },
  { id: 'class-9', name: '8A2' },
]

// Base ingredient definitions
const ING = {
  gaoTam: (suffix: string): Ingredient => ({
    id: `ing-gao-${suffix}`,
    name: 'Gạo tấm',
    gtin: '859358645823',
    soLo: '202643-65',
    company: 'Công ty CP Lương thực Sài Gòn',
    datChuanStatus: 'đạt',
  }),
  gaTuoi: (suffix: string): Ingredient => ({
    id: `ing-ga-${suffix}`,
    name: 'Gà tươi',
    maTem: 'G592852526',
    company: 'Trang trại gà Mỹ Hào',
    datChuanStatus: 'đạt',
  }),
  trungGa: (suffix: string): Ingredient => ({
    id: `ing-trung-${suffix}`,
    name: 'Trứng gà tươi',
    gtin: '815926384756',
    soLo: '210756-42',
    company: 'Trại gà Lương Minh',
    datChuanStatus: 'đạt',
  }),
  gaoLua: (suffix: string): Ingredient => ({
    id: `ing-gaolua-${suffix}`,
    name: 'Gạo lúa ngon',
    gtin: '948273615928',
    soLo: '215843-78',
    company: 'Công ty CP Lương thực Sài Gòn',
    datChuanStatus: 'đạt',
  }),
  rauMuong: (suffix: string): Ingredient => ({
    id: `ing-rau-${suffix}`,
    name: 'Rau muống tươi',
    maTem: 'V128375926',
    company: 'Vườn rau Bình Minh',
    datChuanStatus: 'đạt',
  }),
  caDiec: (suffix: string): Ingredient => ({
    id: `ing-ca-${suffix}`,
    name: 'Cá diếc',
    gtin: '756293847561',
    soLo: '220134-51',
    company: 'Chợ cá Nha Trang',
    datChuanStatus: 'đạt',
  }),
  botMi: (suffix: string): Ingredient => ({
    id: `ing-bot-${suffix}`,
    name: 'Bột mì mịn',
    gtin: '384756928374',
    soLo: '208765-33',
    company: 'Nhà máy bột mì Bình Dương',
    datChuanStatus: 'đạt',
  }),
  suaBo: (suffix: string): Ingredient => ({
    id: `ing-sua-${suffix}`,
    name: 'Sữa bò tươi',
    gtin: '657483920156',
    soLo: '218765-64',
    company: 'Công ty sữa Vinamilk',
    datChuanStatus: 'đạt',
  }),
  chuoiTuoi: (suffix: string): Ingredient => ({
    id: `ing-chuoi-${suffix}`,
    name: 'Chuối tươi',
    maTem: 'F745839201',
    company: 'Trang trại Trái cây Bến Tre',
    datChuanStatus: 'đạt',
  }),
  thitHeo: (suffix: string): Ingredient => ({
    id: `ing-heo-${suffix}`,
    name: 'Thịt heo tươi',
    gtin: '920384756192',
    soLo: '225610-19',
    company: 'Công ty CP Chăn nuôi C.P',
    datChuanStatus: 'đạt',
  }),
  dauHu: (suffix: string): Ingredient => ({
    id: `ing-dau-${suffix}`,
    name: 'Đậu hũ trắng',
    maTem: 'T384756920',
    company: 'Cơ sở đậu hũ Bà Lan',
    datChuanStatus: 'đạt',
  }),
}

// Build one full-day menu for a given date+suffix combo
function buildMenu(dateStr: string, variant: number, classId: string): FoodMenu {
  const s = `${classId}-${dateStr}`
  const menus: FoodMenu[] = [
    {
      date: dateStr,
      timeSections: [
        {
          period: 'Buổi sáng',
          foods: [
            { id: `f-${s}-1`, name: 'Cháo gà', ingredients: [ING.gaoTam(s + '1'), ING.gaTuoi(s + '2')] },
            { id: `f-${s}-2`, name: 'Sữa tươi', ingredients: [ING.suaBo(s + '3')] },
          ],
        },
        {
          period: 'Buổi trưa',
          foods: [
            { id: `f-${s}-3`, name: 'Cơm trắng', ingredients: [ING.gaoLua(s + '4')] },
            { id: `f-${s}-4`, name: 'Canh cá', ingredients: [ING.caDiec(s + '5')] },
            { id: `f-${s}-5`, name: 'Rau muống xào', ingredients: [ING.rauMuong(s + '6')] },
          ],
        },
        {
          period: 'Buổi xế',
          foods: [
            { id: `f-${s}-6`, name: 'Trái cây tươi', ingredients: [ING.chuoiTuoi(s + '7')] },
          ],
        },
      ],
    },
    {
      date: dateStr,
      timeSections: [
        {
          period: 'Buổi sáng',
          foods: [
            { id: `f-${s}-1`, name: 'Bánh mì thịt', ingredients: [ING.botMi(s + '1'), ING.thitHeo(s + '2')] },
            { id: `f-${s}-2`, name: 'Sữa tươi', ingredients: [ING.suaBo(s + '3')] },
          ],
        },
        {
          period: 'Buổi trưa',
          foods: [
            { id: `f-${s}-3`, name: 'Cơm trắng', ingredients: [ING.gaoLua(s + '4')] },
            { id: `f-${s}-4`, name: 'Đậu hũ chiên', ingredients: [ING.dauHu(s + '5')] },
            { id: `f-${s}-5`, name: 'Canh rau muống', ingredients: [ING.rauMuong(s + '6')] },
          ],
        },
        {
          period: 'Buổi xế',
          foods: [
            { id: `f-${s}-6`, name: 'Trứng cuộn', ingredients: [ING.trungGa(s + '7')] },
          ],
        },
      ],
    },
    {
      date: dateStr,
      timeSections: [
        {
          period: 'Buổi sáng',
          foods: [
            { id: `f-${s}-1`, name: 'Cháo thịt heo', ingredients: [ING.gaoTam(s + '1'), ING.thitHeo(s + '2')] },
          ],
        },
        {
          period: 'Buổi trưa',
          foods: [
            { id: `f-${s}-3`, name: 'Cơm trắng', ingredients: [ING.gaoLua(s + '4')] },
            { id: `f-${s}-4`, name: 'Canh cá', ingredients: [ING.caDiec(s + '5')] },
            { id: `f-${s}-5`, name: 'Đậu hũ sốt cà', ingredients: [ING.dauHu(s + '6')] },
          ],
        },
        {
          period: 'Buổi xế',
          foods: [
            { id: `f-${s}-6`, name: 'Trái cây tươi', ingredients: [ING.chuoiTuoi(s + '7')] },
            { id: `f-${s}-7`, name: 'Sữa tươi', ingredients: [ING.suaBo(s + '8')] },
          ],
        },
      ],
    },
  ]
  return menus[variant % 3]
}

// TODAY is 30/06/2026. Generate 15 days: -7 … +7 relative to today.
const TODAY = new Date(2026, 5, 30) // month is 0-indexed

function dateOffset(offset: number): string {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offset)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function buildClassMenus(classId: string, variantOffset: number): Record<string, FoodMenu> {
  const result: Record<string, FoodMenu> = {}
  for (let i = -7; i <= 7; i++) {
    const dateStr = dateOffset(i)
    result[dateStr] = buildMenu(dateStr, i + variantOffset, classId)
  }
  return result
}

export const MOCK_FOOD_MENUS: Record<string, Record<string, FoodMenu>> = {
  'class-1': buildClassMenus('class-1', 0),
  'class-2': buildClassMenus('class-2', 1),
  'class-3': buildClassMenus('class-3', 2),
  'class-4': buildClassMenus('class-4', 3),
  'class-5': buildClassMenus('class-5', 4),
  'class-6': buildClassMenus('class-6', 5),
  'class-7': buildClassMenus('class-7', 6),
  'class-8': buildClassMenus('class-8', 7),
  'class-9': buildClassMenus('class-9', 8),
}

export const TODAY_STR = dateOffset(0) // '30/06/2026'

// ─── Attendance Types ──────────────────────────────────────────────────────

export type AttendanceStatus = 'chưa-điểm-danh' | 'đúng-giờ' | 'đi-trễ' | 'vắng-có-phép' | 'vắng-không-phép' | 'chờ-duyệt'
export type CheckoutStatus = 'chưa-trả' | 'về-đúng-giờ' | 'về-muộn'
export type AbsenceRequestStatus = 'chờ-duyệt' | 'đã-duyệt' | 'đã-hủy'

export interface Student {
  id: string
  name: string
  avatar?: string
  studentCode: string
}

export interface CheckInRecord {
  studentId: string
  date: string
  checkInTime?: string // HH:MM format
  status: AttendanceStatus
  note?: string
  absenceRequestId?: string
}

export interface CheckOutRecord {
  studentId: string
  date: string
  checkOutTime?: string // HH:MM format
  status: CheckoutStatus
  note?: string
}

export interface AbsenceRequest {
  id: string
  studentId: string
  date: string
  reason: string
  requestedAt: string // ISO timestamp
  requestStatus: AbsenceRequestStatus
}

// School operation times
export const SCHOOL_CHECK_IN_TIME = '08:00'
export const SCHOOL_CHECK_OUT_TIME = '16:30'

// 20 students per class
const STUDENT_NAMES = [
  'Nguyễn Văn An', 'Trần Thị Bảo', 'Lê Minh Châu', 'Phạm Quốc Đạt', 'Hoàng Hữu Em',
  'Vũ Thanh Phương', 'Đặng Kiều Giang', 'Cao Huy Hoàng', 'Bùi Thanh Ick', 'Đỗ Minh K',
  'Dương Lâm', 'Trần Tuấn Long', 'Ngô Thị Minh', 'Phan Nhật Nam', 'Quách Thị Oàn',
  'Raman Phạm', 'Sơn Thị Quỳnh', 'Tô Văn Ronaldo', 'Ưu Hữu Sơn', 'Võ Minh Tân',
]

// Deterministic 8-digit student code from classId + index
function make8DigitCode(classId: string, idx: number): string {
  const seed = classId.replace(/\D/g, '') || '7'
  const base = parseInt(seed) * 1000000 + idx * 37 * 1000 + 10000000
  return String(base % 100000000).padStart(8, '0')
}

export function generateStudentsForClass(classId: string): Student[] {
  return STUDENT_NAMES.map((name, idx) => ({
    id: `student-${classId}-${idx}`,
    name,
    studentCode: make8DigitCode(classId, idx),
  }))
}

// Generate attendance records for today + 3 example dates
export function generateAttendanceRecords(
  classId: string,
  date: string
): Record<string, CheckInRecord> {
  const students = generateStudentsForClass(classId)
  const records: Record<string, CheckInRecord> = {}

  students.forEach((student, idx) => {
    const rand = (idx * 13) % 100
    let status: AttendanceStatus = 'chưa-điểm-danh'
    let checkInTime: string | undefined

    if (rand < 70) {
      // 70% on-time
      status = 'đúng-giờ'
      const minutes = 5 + Math.floor((idx * 7) % 15)
      checkInTime = `07:${String(55 - minutes).padStart(2, '0')}`
    } else if (rand < 85) {
      // 15% late
      status = 'đi-trễ'
      const minutes = 10 + Math.floor((idx * 11) % 20)
      checkInTime = `08:${String(minutes).padStart(2, '0')}`
    } else if (rand < 93) {
      // 8% absent with permission
      status = 'vắng-có-phép'
    } else {
      // 7% absent no permission
      status = 'vắng-không-phép'
    }

    records[student.id] = {
      studentId: student.id,
      date,
      checkInTime,
      status,
      note: status === 'vắng-có-phép' ? 'Bệnh' : undefined,
    }
  })

  return records
}

// Generate checkout records (only for students who checked in)
export function generateCheckoutRecords(
  classId: string,
  date: string,
  checkins: Record<string, CheckInRecord>
): Record<string, CheckOutRecord> {
  const records: Record<string, CheckOutRecord> = {}

  Object.entries(checkins).forEach(([studentId, checkin]) => {
    // Only students who checked in are eligible for checkout
    if (checkin.status === 'đúng-giờ' || checkin.status === 'đi-trễ') {
      const rand = parseInt(studentId.split('-').pop() || '0') * 17
      let status: CheckoutStatus = 'về-đúng-giờ'
      let checkOutTime = '16:30'

      if (rand % 100 < 20) {
        status = 'về-muộn'
        const minutes = 5 + Math.floor((rand * 5) % 30)
        checkOutTime = `16:${String(30 + minutes).padStart(2, '0')}`
      }

      records[studentId] = {
        studentId,
        date,
        checkOutTime,
        status,
      }
    }
  })

  return records
}

const ABSENCE_REASONS = [
  'Con bị sốt, chưa khoẻ',
  'Gia đình có việc riêng',
  'Đám cưới họ hàng nội',
  'Khám bệnh định kỳ',
  'Về quê thăm ông bà',
]

// Generate absence requests for today — returns requests keyed by studentId for easy lookup
export function generateAbsenceRequests(classId: string, date: string): AbsenceRequest[] {
  const students = generateStudentsForClass(classId)
  const requests: AbsenceRequest[] = []

  // index 2 → chờ duyệt, index 7 → đã duyệt, index 14 → đã duyệt (past day requests)
  const configs = [
    { idx: 2, status: 'chờ-duyệt' as AbsenceRequestStatus, reasonIdx: 0, hoursAgo: 1 },
    { idx: 7, status: 'đã-duyệt' as AbsenceRequestStatus, reasonIdx: 1, hoursAgo: 3 },
    { idx: 14, status: 'đã-duyệt' as AbsenceRequestStatus, reasonIdx: 2, hoursAgo: 5 },
    { idx: 4, status: 'chờ-duyệt' as AbsenceRequestStatus, reasonIdx: 3, hoursAgo: 0.5 },
  ]

  configs.forEach(({ idx, status, reasonIdx, hoursAgo }) => {
    const student = students[idx]
    requests.push({
      id: `absence-${classId}-${date}-${idx}`,
      studentId: student.id,
      date,
      reason: ABSENCE_REASONS[reasonIdx],
      requestedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      requestStatus: status,
    })
  })

  return requests
}

// Returns the set of studentIds with approved absence requests for a given date
export function getApprovedAbsenceStudentIds(requests: AbsenceRequest[]): Set<string> {
  return new Set(requests.filter((r) => r.requestStatus === 'đã-duyệt').map((r) => r.studentId))
}

// Returns the set of studentIds with pending absence requests
export function getPendingAbsenceStudentIds(requests: AbsenceRequest[]): Set<string> {
  return new Set(requests.filter((r) => r.requestStatus === 'chờ-duyệt').map((r) => r.studentId))
}

// Pre-generate attendance data for today for class-7 (Lớp 6A2)
export const MOCK_ATTENDANCE_TODAY = generateAttendanceRecords('class-7', TODAY_STR)
export const MOCK_CHECKOUT_TODAY = generateCheckoutRecords('class-7', TODAY_STR, MOCK_ATTENDANCE_TODAY)
export const MOCK_ABSENCE_REQUESTS_TODAY = generateAbsenceRequests('class-7', TODAY_STR)
