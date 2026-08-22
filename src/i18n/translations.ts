export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // Home
    'home.level': 'Level',
    'home.sub': 'sub',
    'home.sessionsCompleted': '{count} session(s) completed',
    'home.scenarioPacks': 'Scenario Packs',
    'home.available': '{count} available',
    'home.chooseScenario': 'Choose scenario',
    'home.settings': 'Settings',

    // Levels
    'levels.title': 'Scenario Packs',
    'levels.completed': '{done}/{total} completed',
    'levels.scrollMore': 'Scroll for more...',
    'levels.allLoaded': 'All {count} scenarios loaded ✓',

    // Decision
    'decision.noScenario': 'No scenario loaded',
    'decision.goBack': 'Go home',
    'decision.marketMoving': 'Market is moving...',
    'decision.seeAutopsy': 'See autopsy →',
    'decision.buy': 'Buy',
    'decision.sell': 'Sell',
    'decision.wait': 'Wait',

    // Autopsy
    'autopsy.title': 'Trade Autopsy',
    'autopsy.timeline': 'Timeline',
    'autopsy.decidedToWait': 'Decided to wait',
    'autopsy.enteredAt': 'Entered {action} at {price}',
    'autopsy.takeProfit': 'Take profit at {price}',
    'autopsy.stopLoss': 'Stop loss at {price}',
    'autopsy.breakeven': 'Closed at breakeven',
    'autopsy.backToProfile': 'Back to profile',
    'autopsy.noData': 'No autopsy data',
    'autopsy.goHome': 'Go home',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.languageDesc': 'Choose app language',
    'settings.resetScores': 'Reset all scores',
    'settings.resetScoresDesc': 'Reset your profile to starting state',
    'settings.resetConfirm': 'This will reset all scores and progress. Are you sure?',
    'settings.resetDone': 'Scores reset to default',
    'settings.about': 'About',
    'settings.version': 'Version',
    'settings.appName': 'Forex Flight Simulator',
    'settings.description': 'Practice trading decisions with realistic XAUUSD scenarios',
    'settings.dataStorage': 'Data Storage',
    'settings.dataStorageDesc': 'All data stored locally on this device',

    // Result badges
    'result.win': 'WIN',
    'result.loss': 'LOSS',
    'result.breakeven': 'BREAKEVEN',
    'result.skipped': 'SKIPPED',
  },
  vi: {
    // Home
    'home.level': 'Cấp',
    'home.sub': 'phụ',
    'home.sessionsCompleted': '{count} buổi học đã hoàn thành',
    'home.scenarioPacks': 'Gói tình huống',
    'home.available': '{count} tình huống',
    'home.chooseScenario': 'Chọn tình huống',
    'home.settings': 'Cài đặt',

    // Levels
    'levels.title': 'Gói tình huống',
    'levels.completed': '{done}/{total} đã hoàn thành',
    'levels.scrollMore': 'Cuộn xuống để xem thêm...',
    'levels.allLoaded': 'Đã tải đủ {count} tình huống ✓',

    // Decision
    'decision.noScenario': 'Chưa có tình huống nào',
    'decision.goBack': 'Về trang chủ',
    'decision.marketMoving': 'Thị trường đang di chuyển...',
    'decision.seeAutopsy': 'Xem phân tích →',
    'decision.buy': 'Mua',
    'decision.sell': 'Bán',
    'decision.wait': 'Chờ',

    // Autopsy
    'autopsy.title': 'Phân tích giao dịch',
    'autopsy.timeline': 'Dòng thời gian',
    'autopsy.decidedToWait': 'Quyết định chờ',
    'autopsy.enteredAt': 'Vào lệnh {action} tại {price}',
    'autopsy.takeProfit': 'Chốt lời tại {price}',
    'autopsy.stopLoss': 'Cắt lỗ tại {price}',
    'autopsy.breakeven': 'Đóng ở mức hòa vốn',
    'autopsy.backToProfile': 'Về hồ sơ',
    'autopsy.noData': 'Không có dữ liệu phân tích',
    'autopsy.goHome': 'Về trang chủ',

    // Settings
    'settings.title': 'Cài đặt',
    'settings.language': 'Ngôn ngữ',
    'settings.languageDesc': 'Chọn ngôn ngữ ứng dụng',
    'settings.resetScores': 'Đặt lại điểm',
    'settings.resetScoresDesc': 'Đặt lại hồ sơ về trạng thái ban đầu',
    'settings.resetConfirm': 'Điều này sẽ đặt lại tất cả điểm và tiến trình. Bạn chắc chắn?',
    'settings.resetDone': 'Đã đặt lại điểm mặc định',
    'settings.about': 'Giới thiệu',
    'settings.version': 'Phiên bản',
    'settings.appName': 'Forex Flight Simulator',
    'settings.description': 'Thực hành ra quyết định giao dịch với các tình huống XAUUSD thực tế',
    'settings.dataStorage': 'Lưu trữ dữ liệu',
    'settings.dataStorageDesc': 'Tất cả dữ liệu được lưu cục bộ trên thiết bị này',

    // Result badges
    'result.win': 'THắng',
    'result.loss': 'THua',
    'result.breakeven': 'HÒA VỐN',
    'result.skipped': 'BỎ QUA',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
