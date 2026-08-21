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

// ─── Kết quả học tập (Student Report Card) Types ───────────────────────────
//
// New feature — no precedent elsewhere in this codebase. Cloned from a
// Parent-app spec (ket-qua-hoc-tap-flow-spec.md) into Teacher app. Unlike
// every other feature here, this one is inherently per-STUDENT, not
// per-class — so it adds a second picker layer (chọn lớp → chọn học sinh)
// on top of the class-picker pattern already used by Điểm danh/Thực đơn lớp.
// Subject lists + which subjects get a numeric điểm vs Đạt/Chưa đạt are
// sourced from the school's real Thông tư 22/27 grading matrices (supplied
// separately), not the spec's screenshots — those mixed subjects from
// multiple grade levels into one demo list.

export type CapHoc = 1 | 2 | 3

export function capHocFromGrade(grade: number): CapHoc {
  if (grade <= 5) return 1
  if (grade <= 9) return 2
  return 3
}

export interface KetQuaHocTapClass extends ClassInfo {
  grade: number
}

// Feature-scoped class list (separate from MOCK_CLASSES/DIEM_DANH_CLASSES,
// same pattern already used for Điểm danh) — one class per cấp học so the
// branching UI (Cấp 1 vs Cấp 2&3) can be demoed end to end.
// Names intentionally bare (no "Lớp " prefix) — classSubtitle() adds that
// prefix itself; MOCK_CLASSES baking "Lớp " into the name is a pre-existing
// quirk elsewhere in the codebase that doubles up the prefix, not repeated here.
export const KET_QUA_HOC_TAP_CLASSES: KetQuaHocTapClass[] = [
  { id: 'kqht-class-1', name: '1A', grade: 1 },
  { id: 'kqht-class-2', name: '8A1', grade: 8, isHomeroom: true },
  { id: 'kqht-class-3', name: '11A1', grade: 11 },
]

export interface KetQuaHocTapStudent {
  id: string
  classId: string
  name: string
  // Second student per class carries real scores; the first is left at the
  // "—" empty state to match the spec's original screenshots.
  hasScores: boolean
}

export const KET_QUA_HOC_TAP_STUDENTS: KetQuaHocTapStudent[] = [
  { id: 'kqht-student-1', classId: 'kqht-class-1', name: 'Nguyễn Minh An', hasScores: false },
  { id: 'kqht-student-2', classId: 'kqht-class-1', name: 'Trần Bảo Ngọc', hasScores: true },
  { id: 'kqht-student-3', classId: 'kqht-class-2', name: 'Lê Gia Huy', hasScores: false },
  { id: 'kqht-student-4', classId: 'kqht-class-2', name: 'Phạm Thùy Linh', hasScores: true },
  { id: 'kqht-student-5', classId: 'kqht-class-3', name: 'Vũ Đức Anh', hasScores: false },
  { id: 'kqht-student-6', classId: 'kqht-class-3', name: 'Đỗ Thu Hà', hasScores: true },
]

interface KQHTSubject {
  id: string
  name: string
  /** true = có điểm số (KTĐK / ĐĐGTX-GK-CK-TBHK); false = chỉ Đạt/Chưa đạt */
  scored: boolean
}

// Lớp 1 — 8 môn bắt buộc thực tế (Tin học&CN, Lịch sử-Địa lý, Khoa học chỉ
// bắt đầu từ lớp 3+/4+; Ngoại ngữ 1 ở lớp 1-2 chỉ là tự chọn/làm quen nên
// không tính là môn có đánh giá chính thức).
const CAP1_SUBJECTS: KQHTSubject[] = [
  { id: 'tieng-viet', name: 'Tiếng Việt', scored: true },
  { id: 'toan', name: 'Toán', scored: true },
  { id: 'dao-duc', name: 'Đạo đức', scored: false },
  { id: 'tnxh', name: 'Tự nhiên và Xã hội', scored: false },
  { id: 'gdtc', name: 'Giáo dục thể chất', scored: false },
  { id: 'am-nhac', name: 'Nghệ thuật – Âm nhạc', scored: false },
  { id: 'mi-thuat', name: 'Nghệ thuật – Mĩ thuật', scored: false },
  { id: 'hdtn', name: 'Hoạt động trải nghiệm', scored: false },
]

// Lớp 8 (THCS) — 13 môn bắt buộc, bỏ 2 môn tự chọn (Tiếng DTTS/Ngoại ngữ 2).
const THCS_SUBJECTS: KQHTSubject[] = [
  { id: 'ngu-van', name: 'Ngữ văn', scored: true },
  { id: 'toan', name: 'Toán', scored: true },
  { id: 'ngoai-ngu-1', name: 'Ngoại ngữ 1', scored: true },
  { id: 'gdcd', name: 'GDCD', scored: true },
  { id: 'lich-su-dia-li', name: 'Lịch sử và Địa lí', scored: true },
  { id: 'khtn', name: 'Khoa học tự nhiên', scored: true },
  { id: 'cong-nghe', name: 'Công nghệ', scored: true },
  { id: 'tin-hoc', name: 'Tin học', scored: true },
  { id: 'gdtc', name: 'Giáo dục thể chất', scored: false },
  { id: 'am-nhac', name: 'Nghệ thuật – Âm nhạc', scored: false },
  { id: 'mi-thuat', name: 'Nghệ thuật – Mĩ thuật', scored: false },
  { id: 'hdtn-hn', name: 'Hoạt động trải nghiệm, hướng nghiệp', scored: false },
  { id: 'gd-dia-phuong', name: 'Nội dung giáo dục của địa phương', scored: false },
]

// Lớp 11 (THPT) — 8 môn bắt buộc + tổ hợp lựa chọn Khoa học tự nhiên
// (Vật lí, Hóa học, Sinh học).
const THPT_SUBJECTS: KQHTSubject[] = [
  { id: 'ngu-van', name: 'Ngữ văn', scored: true },
  { id: 'toan', name: 'Toán', scored: true },
  { id: 'ngoai-ngu-1', name: 'Ngoại ngữ 1', scored: true },
  { id: 'lich-su', name: 'Lịch sử', scored: true },
  { id: 'gdqp-an', name: 'Giáo dục quốc phòng và an ninh', scored: true },
  { id: 'vat-li', name: 'Vật lí', scored: true },
  { id: 'hoa-hoc', name: 'Hóa học', scored: true },
  { id: 'sinh-hoc', name: 'Sinh học', scored: true },
  { id: 'gdtc', name: 'Giáo dục thể chất', scored: false },
  { id: 'hdtn-hn', name: 'Hoạt động trải nghiệm, hướng nghiệp', scored: false },
  { id: 'gd-dia-phuong', name: 'Nội dung giáo dục của địa phương', scored: false },
]

function subjectsForClass(classId: string): KQHTSubject[] {
  if (classId === 'kqht-class-1') return CAP1_SUBJECTS
  if (classId === 'kqht-class-2') return THCS_SUBJECTS
  return THPT_SUBJECTS
}

// ── Cấp 1 (Tiểu học) ────────────────────────────────────────────────────

export type Cap1TabId = 'giua-hk1' | 'hk1' | 'giua-hk2' | 'cuoi-nam'

export const CAP1_TABS: { id: Cap1TabId; label: string }[] = [
  { id: 'giua-hk1', label: 'Giữa học kỳ I' },
  { id: 'hk1', label: 'Học kỳ I' },
  { id: 'giua-hk2', label: 'Giữa học kỳ II' },
  { id: 'cuoi-nam', label: 'Cuối năm' },
]

export interface Cap1MonHocRow {
  name: string
  ktdk: string
  mucDatDuoc: string
}

export interface Cap1NangLucRow {
  name: string
  mucDatDuoc: string
}

export interface Cap1TabData {
  monHoc: Cap1MonHocRow[]
  nangLucChung: Cap1NangLucRow[]
  nangLucDacThu: Cap1NangLucRow[]
  phamChat: Cap1NangLucRow[]
}

const NANG_LUC_CHUNG_NAMES = ['Tự chủ và tự học', 'Giao tiếp và hợp tác', 'Giải quyết vấn đề và sáng tạo']
const NANG_LUC_DAC_THU_NAMES = ['Ngôn ngữ', 'Tính toán', 'Khoa học', 'Công nghệ', 'Tin học', 'Thẩm mĩ', 'Thể chất']
const PHAM_CHAT_NAMES = ['Yêu nước', 'Nhân ái', 'Chăm chỉ', 'Trung thực', 'Trách nhiệm']

/** Card 1 (theo môn): Hoàn thành tốt (T) / Hoàn thành (H) / Chưa hoàn thành (C) */
const CARD1_MUC = ['T', 'H', 'C']
/** Card 2/3 (Năng lực, Phẩm chất): Tốt (T) / Đạt (Đ) / Cần cố gắng (C) */
const CARD23_MUC = ['T', 'Đ', 'C']

export function getCap1TabData(studentId: string, classId: string, tabIndex: number): Cap1TabData {
  const student = KET_QUA_HOC_TAP_STUDENTS.find((s) => s.id === studentId)
  const hasScores = student?.hasScores ?? false
  const subjects = subjectsForClass(classId)
  // KTĐK (điểm định kỳ) chỉ áp dụng cho môn "scored", và chỉ xuất hiện ở Học
  // kỳ I (cuối kỳ I) / Cuối năm — không có ở 2 mốc giữa kỳ (theo Thông tư 27).
  const showKtdk = tabIndex === 1 || tabIndex === 3

  const monHoc: Cap1MonHocRow[] = subjects.map((s, i) => {
    if (!hasScores) return { name: s.name, ktdk: '—', mucDatDuoc: '—' }
    const ktdk = s.scored && showKtdk ? String(7 + ((i + tabIndex) % 4)) : '—'
    const mucDatDuoc = CARD1_MUC[(i + tabIndex) % CARD1_MUC.length]
    return { name: s.name, ktdk, mucDatDuoc }
  })

  const buildNangLucRows = (names: string[]): Cap1NangLucRow[] =>
    names.map((name, i) => ({
      name,
      mucDatDuoc: hasScores ? CARD23_MUC[(i + tabIndex) % CARD23_MUC.length] : '—',
    }))

  return {
    monHoc,
    nangLucChung: buildNangLucRows(NANG_LUC_CHUNG_NAMES),
    nangLucDacThu: buildNangLucRows(NANG_LUC_DAC_THU_NAMES),
    phamChat: buildNangLucRows(PHAM_CHAT_NAMES),
  }
}

// ── Cấp 2 & 3 (THCS & THPT) ─────────────────────────────────────────────

export type Cap23TabId = 'hk1' | 'hk2' | 'ca-nam'

export const CAP23_TABS: { id: Cap23TabId; label: string }[] = [
  { id: 'hk1', label: 'Học kỳ I' },
  { id: 'hk2', label: 'Học kỳ II' },
  { id: 'ca-nam', label: 'Cả năm' },
]

/** ĐĐGTX = Điểm đánh giá thường xuyên — 5 đầu điểm con. */
export const DDGTX_COLUMNS = ['Miệng', '15 phút', '1 tiết', '1 tiết', 'Thực hành']

export interface Cap23BangDiemRow {
  name: string
  ddgtx: string[]
  ddggk: string
  ddgck: string
  tbhk: string
}

export interface Cap23NhanXetRow {
  subject: string
  text: string
}

export interface Cap23TongKetRow {
  danhMuc: string
  /** 1 giá trị (Học kỳ I/II) hoặc 3 giá trị (Cả năm: HK1/HK2/Tổng kết) */
  values: string[]
}

export interface Cap23HocKyData {
  tongKet: Cap23TongKetRow[]
  bangDiem: Cap23BangDiemRow[]
  nhanXet: Cap23NhanXetRow[]
}

export interface Cap23CaNamData {
  tongKet: Cap23TongKetRow[]
}

const KET_QUA_HOC_TAP_LEVELS = ['Tốt', 'Khá', 'Đạt', 'Chưa đạt']

const NHAN_XET_POOL = [
  'Con học tập tích cực, tiếp thu bài tốt.',
  'Con chăm chỉ, cần rèn thêm tính cẩn thận.',
  'Con có tiến bộ rõ rệt so với đầu năm.',
  'Con nắm chắc kiến thức cơ bản, phát biểu xây dựng bài tốt.',
  'Con cần tập trung hơn trong giờ học.',
  'Con tích cực tham gia hoạt động nhóm.',
  'Con có năng khiếu, cần phát huy thêm.',
  'Con hoàn thành tốt các bài kiểm tra.',
  'Con cần luyện tập thêm ở nhà để củng cố kiến thức.',
  'Con ngoan, lễ phép, ý thức học tập tốt.',
  'Con sáng tạo trong cách trình bày bài làm.',
  'Con cần cải thiện tốc độ làm bài.',
  'Con tự giác, có trách nhiệm với nhiệm vụ được giao.',
]

function buildBangDiemRow(subject: KQHTSubject, i: number, tabIndex: number, hasScores: boolean): Cap23BangDiemRow {
  if (!hasScores) {
    return { name: subject.name, ddgtx: DDGTX_COLUMNS.map(() => '—'), ddggk: '—', ddgck: '—', tbhk: '—' }
  }
  if (!subject.scored) {
    // Chỉ Nhận xét (Đạt/Chưa đạt) — các cột điểm thành phần không áp dụng,
    // xếp loại cuối cùng hiện ở cột TBHK.
    const passed = (i + tabIndex) % 5 !== 0
    return {
      name: subject.name,
      ddgtx: DDGTX_COLUMNS.map(() => '—'),
      ddggk: '—',
      ddgck: '—',
      tbhk: passed ? 'Đạt' : 'CĐ',
    }
  }
  const base = 6 + ((i + tabIndex) % 4)
  const ddgtx = DDGTX_COLUMNS.map((_, ci) => String(Math.min(10, base + ((ci + i) % 3))))
  const ddggk = String(Math.min(10, base + 1))
  const ddgck = String(Math.min(10, base))
  const tbhk = (base + 0.5).toFixed(1)
  return { name: subject.name, ddgtx, ddggk, ddgck, tbhk }
}

function buildNhanXet(subjects: KQHTSubject[], tabIndex: number): Cap23NhanXetRow[] {
  return subjects.map((s, i) => ({
    subject: s.name,
    text: NHAN_XET_POOL[(i + tabIndex * 3) % NHAN_XET_POOL.length],
  }))
}

export function getCap23HocKyData(studentId: string, classId: string, tabIndex: 0 | 1): Cap23HocKyData {
  const student = KET_QUA_HOC_TAP_STUDENTS.find((s) => s.id === studentId)
  const hasScores = student?.hasScores ?? false
  const subjects = subjectsForClass(classId)

  const tongKet: Cap23TongKetRow[] = [
    { danhMuc: 'Kết quả học tập', values: [hasScores ? KET_QUA_HOC_TAP_LEVELS[tabIndex % 4] : '—'] },
    { danhMuc: 'Kết quả hành vi', values: [hasScores ? KET_QUA_HOC_TAP_LEVELS[(tabIndex + 1) % 4] : '—'] },
    { danhMuc: 'Số ngày nghỉ', values: [hasScores ? String(tabIndex + 1) : '—'] },
  ]

  return {
    tongKet,
    bangDiem: subjects.map((s, i) => buildBangDiemRow(s, i, tabIndex, hasScores)),
    nhanXet: hasScores ? buildNhanXet(subjects, tabIndex) : [],
  }
}

export function getCap23CaNamData(studentId: string): Cap23CaNamData {
  const student = KET_QUA_HOC_TAP_STUDENTS.find((s) => s.id === studentId)
  const hasScores = student?.hasScores ?? false

  const tongKet: Cap23TongKetRow[] = [
    {
      danhMuc: 'Kết quả học tập',
      values: hasScores
        ? [KET_QUA_HOC_TAP_LEVELS[0], KET_QUA_HOC_TAP_LEVELS[1], KET_QUA_HOC_TAP_LEVELS[0]]
        : ['—', '—', '—'],
    },
    {
      danhMuc: 'Kết quả hành vi',
      values: hasScores
        ? [KET_QUA_HOC_TAP_LEVELS[1], KET_QUA_HOC_TAP_LEVELS[0], KET_QUA_HOC_TAP_LEVELS[0]]
        : ['—', '—', '—'],
    },
    {
      danhMuc: 'Số ngày nghỉ',
      values: hasScores ? ['1', '2', '3'] : ['—', '—', '—'],
    },
  ]

  return { tongKet }
}

// ─── Phiếu bé ngoan ─────────────────────────────────────────────────────────
//
// New feature — no precedent elsewhere. Reuses DIEM_DANH_CLASSES/STUDENTS per
// the spec's explicit instruction (same 3 kids as Điểm danh); "Đổi lớp" is
// cosmetic-only (header subtitle), matching how Điểm danh itself already
// treats DIEM_DANH_STUDENTS as one flat roster regardless of selected class.

export type PhieuChuKyLoai = 'tuan' | 'thang'

export interface PhieuChuKyOption {
  id: string
  label: string
}

export const PHIEU_GHI_CHU_MAX_LENGTH = 150

const PHIEU_TODAY = new Date(2026, 5, 30)

function phieuFormatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function phieuWeekOption(mondayOffsetWeeks: number): PhieuChuKyOption {
  const start = new Date(PHIEU_TODAY)
  // PHIEU_TODAY (30/06/2026) is a Tuesday; anchor to that week's Monday first.
  start.setDate(start.getDate() - 1 + mondayOffsetWeeks * 7)
  const end = new Date(start)
  end.setDate(end.getDate() + 5)
  return { id: `phieu-tuan-${mondayOffsetWeeks}`, label: `${phieuFormatDate(start)} - ${phieuFormatDate(end)}` }
}

function phieuMonthOption(monthOffset: number): PhieuChuKyOption {
  const d = new Date(PHIEU_TODAY.getFullYear(), PHIEU_TODAY.getMonth() + monthOffset, 1)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return { id: `phieu-thang-${monthOffset}`, label: `${mm}/${d.getFullYear()}` }
}

// -2..+3 tuần quanh hôm nay — chỉ số 0 là tuần hiện tại (mặc định khi phát mới)
export const PHIEU_TUAN_OPTIONS: PhieuChuKyOption[] = [-2, -1, 0, 2, 3].map(phieuWeekOption)
// -2..+1 tháng quanh hôm nay — chỉ số 0 là tháng hiện tại (mặc định khi phát mới)
export const PHIEU_THANG_OPTIONS: PhieuChuKyOption[] = [-2, -1, 0, 1].map(phieuMonthOption)

export const PHIEU_TUAN_DEFAULT_ID = phieuWeekOption(0).id
export const PHIEU_THANG_DEFAULT_ID = phieuMonthOption(0).id

export interface PhieuHocSinhKetQua {
  studentId: string
  dat: boolean
  nhanXet?: string
}

export interface PhieuBeNgoan {
  id: string
  chuKyLoai: PhieuChuKyLoai
  chuKyId: string
  chuKyLabel: string
  sentAt: string // ISO timestamp
  ketQua: PhieuHocSinhKetQua[]
}

// Module-level mutable array (same pattern as messaging's DYNAMIC_GROUPS) so
// phiếu phát mới/gửi lại trong phiên làm việc vẫn còn khi quay lại màn hình
// Lịch sử, dù không có backend thật.
export const PHIEU_BE_NGOAN_RECORDS: PhieuBeNgoan[] = [
  {
    id: 'phieu-1',
    chuKyLoai: 'tuan',
    chuKyId: 'phieu-tuan--2',
    chuKyLabel: phieuWeekOption(-2).label,
    sentAt: '2026-06-21T09:15:00.000Z',
    ketQua: [
      { studentId: 'dd-student-1', dat: true, nhanXet: 'Bé ngoan, biết chia sẻ đồ chơi với bạn.' },
      { studentId: 'dd-student-2', dat: true },
      { studentId: 'dd-student-3', dat: false },
    ],
  },
  {
    id: 'phieu-2',
    chuKyLoai: 'tuan',
    chuKyId: 'phieu-tuan--1',
    chuKyLabel: phieuWeekOption(-1).label,
    sentAt: '2026-06-28T09:00:00.000Z',
    ketQua: [
      { studentId: 'dd-student-1', dat: true },
      { studentId: 'dd-student-2', dat: true, nhanXet: 'Con tích cực phát biểu trong giờ học.' },
      { studentId: 'dd-student-3', dat: true },
    ],
  },
  {
    id: 'phieu-3',
    chuKyLoai: 'tuan',
    chuKyId: 'phieu-tuan-2',
    chuKyLabel: phieuWeekOption(2).label,
    sentAt: '2026-07-19T08:30:00.000Z',
    ketQua: [
      { studentId: 'dd-student-1', dat: true, nhanXet: 'Bé ngoan, biết chia sẻ đồ chơi với bạn.' },
      { studentId: 'dd-student-2', dat: true },
      { studentId: 'dd-student-3', dat: true },
    ],
  },
  {
    id: 'phieu-4',
    chuKyLoai: 'thang',
    chuKyId: 'phieu-thang--2',
    chuKyLabel: phieuMonthOption(-2).label,
    sentAt: '2026-05-31T10:00:00.000Z',
    ketQua: [
      { studentId: 'dd-student-1', dat: true },
      { studentId: 'dd-student-2', dat: false },
      { studentId: 'dd-student-3', dat: true, nhanXet: 'Con lễ phép, giúp cô dọn đồ chơi mỗi ngày.' },
    ],
  },
  {
    id: 'phieu-5',
    chuKyLoai: 'tuan',
    chuKyId: 'phieu-tuan-3',
    chuKyLabel: phieuWeekOption(3).label,
    sentAt: '2026-07-26T08:45:00.000Z',
    ketQua: [
      { studentId: 'dd-student-1', dat: true },
      { studentId: 'dd-student-2', dat: true },
      { studentId: 'dd-student-3', dat: true },
    ],
  },
]
