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

export const TODAY_STR = dateOffset(0) // '30/06/2026'

// ─── Thực đơn lớp (Class Menu) Types ────────────────────────────────────────
//
// Modeled around thuc-don-flow-spec: a set of fixed weeks (not an infinite
// ±N-days window like the old implementation), each with 6 days (T2–T7) ×
// 3 bữa ăn. The sample week (13/07–18/07/2026) uses literal data transcribed
// from the spec's screenshots; the other 5 weeks are generated deterministically
// from name pools + an index-based ingredient-count pattern, per Open Question
// #6/#7 — diverse and plausible, not required to match a real school's menu.
// Menu data is shared across all classes (Open Question raised during Phase 2
// — the school kitchen cooks one menu for the whole school, "Đổi lớp" only
// changes the header subtitle).

export interface ThucDonNguyenLieu {
  id: string
  name: string
  coSoSanXuat?: string
  maNguyenLieu?: string
  /** Show the static "Xem chi tiết ↗" link (Open Question #2: non-functional placeholder — no real detail page/backend to link to) */
  xemChiTiet?: boolean
  /** Accordion card starts expanded (Open Question #3: true accordion, any card can be toggled) */
  expandedByDefault?: boolean
}

export interface ThucDonMon {
  id: string
  name: string
  ingredients: ThucDonNguyenLieu[]
}

export type ThucDonBuaLoai = 'Ăn sáng' | 'Ăn trưa' | 'Ăn xế'

export interface ThucDonBua {
  period: ThucDonBuaLoai
  foods: ThucDonMon[]
}

export interface ThucDonNgay {
  date: string // dd/MM/yyyy
  thu: string // 'T2'…'T7'
  buaAn: ThucDonBua[] // 3 entries: Ăn sáng, Ăn trưa, Ăn xế
}

export interface ThucDonTuan {
  id: string
  startDate: string // dd/MM/yyyy
  endDate: string // dd/MM/yyyy
  label: string // "13/07/2026 - 18/07/2026"
  days: ThucDonNgay[] // 6 entries T2…T7
  attachmentFileName: string // 1 file per week (Open Question #5)
}

const THU_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function formatVNDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function buildWeekDates(startDateStr: string): string[] {
  const [d, m, y] = startDateStr.split('/').map(Number)
  const start = new Date(y, m - 1, d)
  return Array.from({ length: 6 }, (_, i) => {
    const dt = new Date(start)
    dt.setDate(dt.getDate() + i)
    return formatVNDate(dt)
  })
}

const THUC_DON_WEEK_1_DATES = buildWeekDates('13/07/2026')

// ─── Sample week (13/07–18/07/2026) — literal data transcribed from the spec ──

const monBunBo: ThucDonMon = {
  id: 'mon-bun-bo',
  name: 'Bún bò',
  ingredients: [
    {
      id: 'ndl-ruoc-cha-bong',
      name: 'Ruốc chà bông hàu Bavabi',
      coSoSanXuat: 'Công ty TNHH Chế biến Thực phẩm Bavabi',
      maNguyenLieu: '8936088910141',
      xemChiTiet: true,
      expandedByDefault: true,
    },
    { id: 'ndl-bo-waygu', name: 'Bò waygu', coSoSanXuat: 'Công ty TNHH Thực phẩm Nhật Việt' },
    { id: 'ndl-bun-tuoi-an-xinh', name: 'Bún tươi An Xinh', coSoSanXuat: 'Cơ sở sản xuất bún An Xinh' },
    {
      id: 'ndl-nuoc-khoang-quang-hanh',
      name: 'Nước khoáng thiên nhiên Quang Hanh bổ sung ga',
      coSoSanXuat: 'CÔNG TY TNHH MỘT THÀNH VIÊN NƯỚC KHOÁNG QUANG HANH',
      xemChiTiet: true,
      expandedByDefault: true,
    },
  ],
}

const monComCaHu: ThucDonMon = {
  id: 'mon-com-ca-hu',
  name: 'Cơm cá hú',
  ingredients: [
    {
      id: 'ndl-ca-hu',
      name: 'Cá hú tươi',
      coSoSanXuat: 'Công ty TNHH Hải sản Miền Trung',
      maNguyenLieu: '8936021456789',
      xemChiTiet: true,
      expandedByDefault: true,
    },
    { id: 'ndl-gao-te-ngon', name: 'Gạo tẻ ngon', coSoSanXuat: 'Công ty CP Lương thực Sài Gòn' },
  ],
}

const monNuocEpCam: ThucDonMon = {
  id: 'mon-nuoc-ep-cam',
  name: 'Nước ép cam',
  ingredients: [
    { id: 'ndl-cam-vinh', name: 'Cam tươi Vinh', coSoSanXuat: 'Vườn cam Vinh - Nghệ An', xemChiTiet: true, expandedByDefault: true },
  ],
}

const monBanhUot: ThucDonMon = { id: 'mon-banh-uot', name: 'Bánh ướt', ingredients: [] }
const monComGa: ThucDonMon = { id: 'mon-com-ga', name: 'Cơm gà', ingredients: [] }
const monTraiCayTheoMua: ThucDonMon = { id: 'mon-trai-cay-theo-mua', name: 'Trái cây theo mùa', ingredients: [] }

const monXoiGa: ThucDonMon = { id: 'mon-xoi-ga', name: 'Xôi gà', ingredients: [] }
const monComXiuMai: ThucDonMon = {
  id: 'mon-com-xiu-mai',
  name: 'Cơm xíu mại',
  ingredients: [
    {
      id: 'ndl-xiu-mai',
      name: 'Xíu mại heo',
      coSoSanXuat: 'Trang trại Chăn nuôi Xanh',
      maNguyenLieu: '8936077512233',
      xemChiTiet: true,
      expandedByDefault: true,
    },
  ],
}
const monBanhToffu: ThucDonMon = { id: 'mon-banh-toffu', name: 'Bánh toffu', ingredients: [] }

const monBunMoc: ThucDonMon = {
  id: 'mon-bun-moc',
  name: 'Bún mọc',
  ingredients: [
    {
      id: 'ndl-moc-heo',
      name: 'Mọc viên heo',
      coSoSanXuat: 'Trang trại Chăn nuôi Xanh',
      maNguyenLieu: '8936099213344',
      xemChiTiet: true,
      expandedByDefault: true,
    },
    { id: 'ndl-bun-tuoi-2', name: 'Bún tươi', coSoSanXuat: 'Cơ sở sản xuất bún An Xinh' },
  ],
}
const monBanhMyLagu: ThucDonMon = {
  id: 'mon-banh-my-lagu',
  name: 'Bánh mỳ kiểu Pháp + lagu',
  ingredients: [
    {
      id: 'ndl-banh-my-phap',
      name: 'Bánh mì kiểu Pháp',
      coSoSanXuat: 'Công ty CP Lương thực Sài Gòn',
      maNguyenLieu: '8936044556677',
      xemChiTiet: true,
      expandedByDefault: true,
    },
    { id: 'ndl-thit-bo-lagu', name: 'Thịt bò lagu', coSoSanXuat: 'Trang trại Chăn nuôi Xanh' },
    { id: 'ndl-ca-rot-khoai-tay', name: 'Cà rốt khoai tây', coSoSanXuat: 'Hợp tác xã Rau sạch Đà Lạt' },
  ],
}
const monDauHuSingapore: ThucDonMon = {
  id: 'mon-dau-hu-singapore',
  name: 'Đậu hũ singapore',
  ingredients: [
    { id: 'ndl-dau-hu', name: 'Đậu hũ non', coSoSanXuat: 'Cơ sở đậu hũ Bà Lan', xemChiTiet: true, expandedByDefault: true },
  ],
}

const monBanhBotLoc: ThucDonMon = {
  id: 'mon-banh-bot-loc',
  name: 'Bánh bột lọc',
  ingredients: [
    {
      id: 'ndl-bot-nang',
      name: 'Bột năng',
      coSoSanXuat: 'Nhà máy bột mì Bình Dương',
      maNguyenLieu: '8936011223344',
      xemChiTiet: true,
      expandedByDefault: true,
    },
    { id: 'ndl-tom-tuoi', name: 'Tôm tươi', coSoSanXuat: 'Công ty TNHH Hải sản Miền Trung' },
  ],
}
const monCaRiNhat: ThucDonMon = {
  id: 'mon-ca-ri-nhat',
  name: 'Cà ri Nhật',
  ingredients: [
    {
      id: 'ndl-khoai-tay-ca-ri',
      name: 'Khoai tây',
      coSoSanXuat: 'Hợp tác xã Rau sạch Đà Lạt',
      maNguyenLieu: '8936055667788',
      xemChiTiet: true,
      expandedByDefault: true,
    },
    { id: 'ndl-ga-ta-ca-ri', name: 'Thịt gà ta', coSoSanXuat: 'Trang trại gà Mỹ Hào' },
    { id: 'ndl-ca-rot-ca-ri', name: 'Cà rốt tươi', coSoSanXuat: 'Hợp tác xã Rau sạch Đà Lạt' },
  ],
}
const monHatMix: ThucDonMon = { id: 'mon-hat-mix', name: 'Hạt mix', ingredients: [] }

const monBanhGio: ThucDonMon = {
  id: 'mon-banh-gio',
  name: 'Bánh giò',
  ingredients: [
    {
      id: 'ndl-bot-gao-te',
      name: 'Bột gạo tẻ',
      coSoSanXuat: 'Công ty CP Lương thực Sài Gòn',
      maNguyenLieu: '8936066778899',
      xemChiTiet: true,
      expandedByDefault: true,
    },
    { id: 'ndl-thit-bam-banh-gio', name: 'Thịt heo băm', coSoSanXuat: 'Trang trại Chăn nuôi Xanh' },
  ],
}
const monBunNuocLeo: ThucDonMon = {
  id: 'mon-bun-nuoc-leo',
  name: 'Bún nước lèo',
  ingredients: [
    {
      id: 'ndl-ca-loc',
      name: 'Cá lóc tươi',
      coSoSanXuat: 'Công ty TNHH Hải sản Miền Trung',
      maNguyenLieu: '8936088990011',
      xemChiTiet: true,
      expandedByDefault: true,
    },
    { id: 'ndl-bun-tuoi-3', name: 'Bún tươi', coSoSanXuat: 'Cơ sở sản xuất bún An Xinh' },
    { id: 'ndl-mam-nem', name: 'Mắm nêm', coSoSanXuat: 'Công ty TNHH Hải sản Miền Trung' },
  ],
}
const monSuaTuoi: ThucDonMon = {
  id: 'mon-sua-tuoi',
  name: 'Sữa tươi',
  ingredients: [
    {
      id: 'ndl-sua-tuoi-vinamilk',
      name: 'Sữa tươi tiệt trùng',
      coSoSanXuat: 'Công ty CP Sữa Việt Nam Vinamilk',
      maNguyenLieu: '8936000112233',
      xemChiTiet: true,
      expandedByDefault: true,
    },
  ],
}

const THUC_DON_WEEK_1: ThucDonTuan = {
  id: 'week-2026-07-13',
  startDate: '13/07/2026',
  endDate: '18/07/2026',
  label: '13/07/2026 - 18/07/2026',
  attachmentFileName: 'Thuc-don-tuan-13-07-2026-den-18-07-2026.pdf',
  days: [
    {
      date: THUC_DON_WEEK_1_DATES[0],
      thu: 'T2',
      buaAn: [
        { period: 'Ăn sáng', foods: [monBunBo] },
        { period: 'Ăn trưa', foods: [monComCaHu] },
        { period: 'Ăn xế', foods: [monNuocEpCam] },
      ],
    },
    {
      date: THUC_DON_WEEK_1_DATES[1],
      thu: 'T3',
      buaAn: [
        { period: 'Ăn sáng', foods: [monBanhUot] },
        { period: 'Ăn trưa', foods: [monComGa] },
        { period: 'Ăn xế', foods: [monTraiCayTheoMua] },
      ],
    },
    {
      date: THUC_DON_WEEK_1_DATES[2],
      thu: 'T4',
      buaAn: [
        { period: 'Ăn sáng', foods: [monXoiGa] },
        { period: 'Ăn trưa', foods: [monComXiuMai] },
        { period: 'Ăn xế', foods: [monBanhToffu] },
      ],
    },
    {
      date: THUC_DON_WEEK_1_DATES[3],
      thu: 'T5',
      buaAn: [
        { period: 'Ăn sáng', foods: [monBunMoc] },
        { period: 'Ăn trưa', foods: [monBanhMyLagu] },
        { period: 'Ăn xế', foods: [monDauHuSingapore] },
      ],
    },
    {
      date: THUC_DON_WEEK_1_DATES[4],
      thu: 'T6',
      buaAn: [
        { period: 'Ăn sáng', foods: [monBanhBotLoc] },
        { period: 'Ăn trưa', foods: [monCaRiNhat] },
        { period: 'Ăn xế', foods: [monHatMix] },
      ],
    },
    {
      date: THUC_DON_WEEK_1_DATES[5],
      thu: 'T7',
      buaAn: [
        { period: 'Ăn sáng', foods: [monBanhGio] },
        { period: 'Ăn trưa', foods: [monBunNuocLeo] },
        { period: 'Ăn xế', foods: [monSuaTuoi] },
      ],
    },
  ],
}

// ─── Other 5 weeks — generated deterministically from name pools ──────────────

const THUC_DON_OTHER_WEEKS_META: { id: string; startDate: string; endDate: string }[] = [
  { id: 'week-2026-07-06', startDate: '06/07/2026', endDate: '11/07/2026' },
  { id: 'week-2026-06-29', startDate: '29/06/2026', endDate: '04/07/2026' },
  { id: 'week-2026-05-18', startDate: '18/05/2026', endDate: '23/05/2026' },
  { id: 'week-2026-05-04', startDate: '04/05/2026', endDate: '09/05/2026' },
  { id: 'week-2026-04-20', startDate: '20/04/2026', endDate: '25/04/2026' },
]

// 5 tuần × 6 ngày = 30 tên món mỗi loại bữa, không lặp lại tên món ở tuần mẫu.
const THUC_DON_BREAKFAST_POOL = [
  'Bún riêu cua', 'Súp gà nấm', 'Bánh canh chả cá', 'Cháo lươn', 'Bánh mì ốp la', 'Xôi xéo',
  'Bánh cuốn nhân thịt', 'Phở bò', 'Cháo cá lóc', 'Bánh bao nhân thịt', 'Miến gà', 'Bún thang',
  'Bánh canh cua', 'Cháo thịt bằm', 'Xôi đậu xanh', 'Bánh mì trứng ốp la', 'Bún mắm', 'Hủ tiếu nam vang',
  'Bánh đa cua', 'Cháo vịt', 'Xôi lạc', 'Bánh mì pate', 'Bún cá', 'Súp cua trứng bắc thảo',
  'Bánh canh tôm', 'Cháo sườn', 'Xôi gấc', 'Bánh mì chảo', 'Bún ốc', 'Mì Quảng gà',
]
const THUC_DON_LUNCH_POOL = [
  'Cơm sườn nướng', 'Cơm gà xối mỡ', 'Cơm thịt kho trứng', 'Cơm cá kho tộ', 'Bún chả', 'Cơm chiên dương châu',
  'Cơm canh chua cá lóc', 'Mì Ý sốt bò bằm', 'Cơm gà rim nước mắm', 'Cơm đậu que xào thịt', 'Cơm cá thu sốt cà', 'Bánh canh giò heo',
  'Cơm sườn xào chua ngọt', 'Cơm cá basa kho', 'Cơm thịt viên sốt cà', 'Cơm canh bí đỏ thịt bằm', 'Bún bò xào', 'Cơm gà kho gừng',
  'Cơm mực xào thập cẩm', 'Cơm thịt kho tàu', 'Cơm canh rau ngót thịt bằm', 'Cơm cá diêu hồng chiên', 'Bún riêu chay', 'Cơm gà nướng mật ong',
  'Cơm tôm rim thịt', 'Cơm canh khoai mỡ', 'Cơm thịt heo quay', 'Cơm cá ngừ sốt cà', 'Nui xào bò', 'Cơm gà xào sả ớt',
]
const THUC_DON_SNACK_POOL = [
  'Chè đậu xanh', 'Bánh flan', 'Sữa chua', 'Bánh bông lan trứng muối', 'Chuối chiên', 'Bánh su kem',
  'Nước ép dưa hấu', 'Khoai lang hấp', 'Bánh plan caramen', 'Trái cây tổng hợp', 'Sữa đậu nành', 'Bánh quy yến mạch',
  'Chè khúc bạch', 'Bánh bò nướng', 'Sữa chua nếp cẩm', 'Nước ép cà rốt', 'Bắp luộc', 'Bánh da lợn',
  'Chè bưởi', 'Bánh tiêu', 'Sữa tươi trân châu', 'Trái cây dầm', 'Khoai lang kén', 'Bánh chuối hấp',
  'Chè Thái', 'Bánh rán mật', 'Sữa chua nha đam', 'Nước ép táo', 'Đậu phộng luộc', 'Bánh bao chỉ',
]

const THUC_DON_COMPANY_POOL = [
  'Công ty TNHH Chế biến Thực phẩm Bavabi',
  'Công ty CP Lương thực Sài Gòn',
  'Hợp tác xã Rau sạch Đà Lạt',
  'Trang trại Chăn nuôi Xanh',
  'Công ty CP Sữa Việt Nam Vinamilk',
  'Cơ sở sản xuất bún An Xinh',
  'Công ty TNHH Hải sản Miền Trung',
  'Nhà máy bột mì Bình Dương',
]
const THUC_DON_INGREDIENT_NAME_POOL = [
  'Gạo tẻ ngon', 'Thịt heo tươi', 'Thịt bò tươi', 'Trứng gà ta', 'Rau cải xanh',
  'Cà rốt tươi', 'Hành tây', 'Bún tươi', 'Bánh phở tươi', 'Đậu hũ non',
  'Cá basa phi lê', 'Tôm tươi', 'Nấm rơm', 'Khoai tây', 'Sữa tươi tiệt trùng',
  'Cải thìa', 'Bí đỏ', 'Đậu que', 'Thịt gà ta', 'Nước mắm truyền thống',
]
// Số nguyên liệu mỗi món (0–4) — mô phỏng lại tỉ lệ trộn 0/1/2/3/4 quan sát
// được ở tuần mẫu (Open Question #7), chọn theo index thay vì random.
const THUC_DON_ING_COUNT_PATTERN = [2, 0, 3, 1, 4, 0, 2, 1, 3, 0]

function buildIngredient(seed: number): ThucDonNguyenLieu {
  const name = THUC_DON_INGREDIENT_NAME_POOL[seed % THUC_DON_INGREDIENT_NAME_POOL.length]
  const company = THUC_DON_COMPANY_POOL[seed % THUC_DON_COMPANY_POOL.length]
  const hasCode = seed % 2 === 0
  const hasLink = seed % 3 !== 2
  return {
    id: `ndl-auto-${seed}`,
    name,
    coSoSanXuat: company,
    maNguyenLieu: hasCode ? `8936088${(9100 + seed) % 10000}` : undefined,
    xemChiTiet: hasLink,
    expandedByDefault: seed % 4 === 0,
  }
}

function buildMonAuto(seed: number, name: string, count: number): ThucDonMon {
  return {
    id: `mon-auto-${seed}`,
    name,
    ingredients: Array.from({ length: count }, (_, i) => buildIngredient(seed * 10 + i)),
  }
}

function buildOtherWeek(weekIdx: number, meta: { id: string; startDate: string; endDate: string }): ThucDonTuan {
  const dates = buildWeekDates(meta.startDate)
  const days: ThucDonNgay[] = THU_LABELS.map((thu, dayIdx) => {
    const poolIdx = weekIdx * 6 + dayIdx
    const seedBase = (weekIdx + 1) * 100 + dayIdx * 10
    return {
      date: dates[dayIdx],
      thu,
      buaAn: [
        {
          period: 'Ăn sáng',
          foods: [buildMonAuto(seedBase + 1, THUC_DON_BREAKFAST_POOL[poolIdx], THUC_DON_ING_COUNT_PATTERN[(seedBase + 1) % THUC_DON_ING_COUNT_PATTERN.length])],
        },
        {
          period: 'Ăn trưa',
          foods: [buildMonAuto(seedBase + 2, THUC_DON_LUNCH_POOL[poolIdx], THUC_DON_ING_COUNT_PATTERN[(seedBase + 2) % THUC_DON_ING_COUNT_PATTERN.length])],
        },
        {
          period: 'Ăn xế',
          foods: [buildMonAuto(seedBase + 3, THUC_DON_SNACK_POOL[poolIdx], THUC_DON_ING_COUNT_PATTERN[(seedBase + 3) % THUC_DON_ING_COUNT_PATTERN.length])],
        },
      ],
    }
  })
  return {
    id: meta.id,
    startDate: meta.startDate,
    endDate: meta.endDate,
    label: `${meta.startDate} - ${meta.endDate}`,
    attachmentFileName: `Thuc-don-tuan-${meta.startDate.replace(/\//g, '-')}-den-${meta.endDate.replace(/\//g, '-')}.pdf`,
    days,
  }
}

// Tuần mẫu (13/07–18/07) luôn đứng đầu danh sách và là tuần mặc định active,
// đúng thứ tự "Danh sách 6 tuần" trong spec.
export const MOCK_THUC_DON_WEEKS: ThucDonTuan[] = [
  THUC_DON_WEEK_1,
  ...THUC_DON_OTHER_WEEKS_META.map((meta, idx) => buildOtherWeek(idx, meta)),
]

export const THUC_DON_SCHOOL_INFO = {
  name: 'Trường THCS Demo Soha',
  address: '123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh',
  email: 'lienhe@demosoha.edu.vn',
}

// ─── Điểm danh (Attendance) Types ──────────────────────────────────────────
//
// AttendanceStatus/CheckoutStatus encode the underlying record; badge *labels*
// shown in the UI are derived from these (see attendance/shared.tsx) — some
// labels intentionally diverge from the status name (see diem-danh-flow-spec
// Open Question #3: "Trả học sinh" keeps the literal "Chưa đón" wording).

export type AttendanceStatus = 'chưa-đón' | 'có-mặt' | 'đến-muộn' | 'vắng-có-phép' | 'vắng-không-phép'
export type CheckoutStatus = 'chưa-về' | 'đã-về' | 'vắng-có-phép' | 'vắng-không-phép'
export type AbsenceRequestStatus = 'chờ-duyệt' | 'đã-duyệt' | 'đã-huỷ'

export interface DiemDanhStudent {
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

// School operation times — also the threshold used to auto-derive "Đến muộn"
// vs "Có mặt" at check-in time (diem-danh-flow-spec Open Question #5).
export const SCHOOL_CHECK_IN_TIME = '08:00'
export const SCHOOL_CHECK_OUT_TIME = '16:30'

// Classes the teacher can switch between in the "Chọn lớp" sheet (Lớp 6A2 is
// their homeroom class; 8A1/8A10 are subject classes with no secondary label
// per Open Question #7). Scoped to the Điểm danh feature — MOCK_CLASSES above
// is a separate, larger list used by Thực đơn lớp and isn't touched here.
export const DIEM_DANH_CLASSES: ClassInfo[] = [
  { id: 'class-7', name: 'Lớp 6A2', isHomeroom: true },
  { id: 'class-8', name: '8A1' },
  { id: 'class-10', name: '8A10' },
]

// Fixed 3-student roster per diem-danh-flow-spec sample data.
export const DIEM_DANH_STUDENTS: DiemDanhStudent[] = [
  { id: 'dd-student-1', name: 'Nguyễn Hoàng Huyền Diệu', avatar: '/placeholder-user.jpg', studentCode: 'KID0005' },
  { id: 'dd-student-2', name: 'Phạm Thu Trang', studentCode: 'KID0006' },
  { id: 'dd-student-3', name: 'Hoàng Thanh Trúc', studentCode: 'KID0008' },
]

export function createInitialCheckInRecords(date: string): Record<string, CheckInRecord> {
  const records: Record<string, CheckInRecord> = {}
  DIEM_DANH_STUDENTS.forEach((s) => {
    records[s.id] = { studentId: s.id, date, status: 'chưa-đón' }
  })
  return records
}

export function createInitialCheckOutRecords(date: string): Record<string, CheckOutRecord> {
  const records: Record<string, CheckOutRecord> = {}
  DIEM_DANH_STUDENTS.forEach((s) => {
    records[s.id] = { studentId: s.id, date, status: 'chưa-về' }
  })
  return records
}

// No sample absence-request data is defined in diem-danh-flow-spec (Diem danh
// 6 only illustrates the empty state) — starts empty.
export const DIEM_DANH_ABSENCE_REQUESTS: AbsenceRequest[] = []

// ─── Messaging Types ──────────────────────────────────────────────────────────

export type MessageType = 'text' | 'request'
export type RequestType = 'medicine' | 'absence' | 'pickup' | 'note'
export type RequestStatus = 'pending' | 'acknowledged' | 'rejected'

export interface MessageRequest {
  id: string
  type: RequestType
  title: string
  description: string
  appliesDate?: string
  status: RequestStatus
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: 'teacher' | 'parent'
  timestamp: string
  messageType: MessageType
  text?: string
  request?: MessageRequest
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  participantIds: string[]
  displayName: string
  displayAvatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  // Short class code ('6A2' | '8A1' | '7B1') the conversation belongs to —
  // used by the "Trao đổi" tab filter (and "Tất cả" when unset/empty).
  classFilter?: string
  // Direct (1:1) conversations only — the list row shows student name (used
  // for search) above the smaller parent name, instead of a single displayName.
  studentName?: string
  parentName?: string
}

// Mock parent data
const PARENTS = [
  { id: 'parent-1', name: 'Lê Thị Hoa', studentName: 'Minh An', studentId: 'student-class-7-2' },
  { id: 'parent-2', name: 'Trần Văn Hùng', studentName: 'Quỳnh Anh', studentId: 'student-class-7-7' },
  { id: 'parent-3', name: 'Nguyễn Thị Thu', studentName: 'Đăng Khôi', studentId: 'student-class-7-4' },
  { id: 'parent-4', name: 'Phạm Minh Hiếu', studentName: 'Bảo Châu', studentId: 'student-class-7-9' },
  { id: 'parent-5', name: 'Võ Thanh Hoa', studentName: 'Gia Hân', studentId: 'student-class-7-14' },
]

// Mock conversations list
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    type: 'group',
    participantIds: ['teacher-1', ...PARENTS.map((p) => p.id)],
    displayName: 'Nhóm Lớp 6A2',
    unreadCount: 0,
    classFilter: '6A2',
    lastMessage: 'Bạn: 7h30 tập trung ở sân trường nhé.',
    lastMessageTime: '08:50',
  },
  {
    id: 'conv-2',
    type: 'direct',
    participantIds: ['teacher-1', 'parent-1'],
    displayName: 'PH bé Minh An',
    studentName: 'Nguyễn Minh An',
    parentName: 'Lê Thị Hoa',
    classFilter: '6A2',
    lastMessage: '💊 Dặn thuốc — Paracetamol 250mg',
    lastMessageTime: '10:02',
    unreadCount: 1,
  },
  {
    id: 'conv-3',
    type: 'direct',
    participantIds: ['teacher-1', 'parent-2'],
    displayName: 'PH bé Quỳnh Anh',
    studentName: 'Trần Quỳnh Anh',
    parentName: 'Trần Văn Hùng',
    classFilter: '6A2',
    lastMessage: 'Dạ em cảm ơn cô nhiều ạ',
    lastMessageTime: '09:15',
    unreadCount: 0,
  },
  {
    id: 'conv-4',
    type: 'direct',
    participantIds: ['teacher-1', 'parent-3'],
    displayName: 'PH bé Đăng Khôi',
    studentName: 'Lê Đăng Khôi',
    parentName: 'Nguyễn Thị Thu',
    classFilter: '6A2',
    lastMessage: 'Nhờ cô để ý bé giúp em ạ',
    lastMessageTime: 'Hôm qua',
    unreadCount: 0,
  },
  {
    id: 'conv-5',
    type: 'direct',
    participantIds: ['teacher-1', 'parent-5'],
    displayName: 'PH bé Gia Hân',
    studentName: 'Võ Gia Hân',
    parentName: 'Võ Thanh Hoa',
    classFilter: '6A2',
    lastMessage: 'Bé nay nghỉ ốm cô nhé',
    lastMessageTime: 'T3',
    unreadCount: 0,
  },
]

// Mock messages for direct conversation with parent-1 (Minh An)
export const MOCK_MESSAGES_DIRECT: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'parent-1',
    senderName: 'Mẹ bé Minh An',
    senderRole: 'parent',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    messageType: 'text',
    text: 'Chào cô, sáng nay bé hơi sốt nhẹ ạ.',
  },
  {
    id: 'msg-2',
    senderId: 'parent-1',
    senderName: 'Mẹ bé Minh An',
    senderRole: 'parent',
    timestamp: new Date(Date.now() - 118 * 60000).toISOString(),
    messageType: 'request',
    request: {
      id: 'req-1',
      type: 'medicine',
      title: 'Dặn thuốc',
      description: 'Paracetamol 250mg — sau bữa trưa, 1 gói. Áp dụng hôm nay.',
      appliesDate: TODAY_STR,
      status: 'pending',
    },
  },
  {
    id: 'msg-3',
    senderId: 'teacher-1',
    senderName: 'Cô Nguyễn Hồng',
    senderRole: 'teacher',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    messageType: 'text',
    text: 'Cảm ơn, cô sẽ chú ý cho bé ạ.',
  },
]

// Mock messages for group conversation
export const MOCK_MESSAGES_GROUP: ChatMessage[] = [
  {
    id: 'gmsg-1',
    senderId: 'teacher-1',
    senderName: 'Cô Nguyễn Hồng · GVCN',
    senderRole: 'teacher',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    messageType: 'text',
    text: '7h30 tập trung ở sân trường nhé.',
  },
  {
    id: 'gmsg-2',
    senderId: 'parent-5',
    senderName: 'Mẹ bé Gia Hân',
    senderRole: 'parent',
    timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
    messageType: 'text',
    text: 'Dạ cô, cảm ơn cô ạ',
  },
]

export const MOCK_TEACHER_INFO = {
  id: 'teacher-1',
  name: 'Cô Nguyễn Hồng',
  classId: 'class-7',
  className: 'Lớp 6A2',
  studentCount: 32,
}
