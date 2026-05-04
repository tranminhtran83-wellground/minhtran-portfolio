/**
 * Language Context for Bilingual Support (EN/VI)
 * Client-side language switching with localStorage persistence
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'vi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    // Header Navigation
    'header.home': 'The Garden',
    'header.about': 'The Growth',
    'header.projects': 'Building Legacy',
    'header.blog': 'Blog',
    'header.contact': 'Say Hello',
    'header.admin': 'Admin',
    'header.language': 'Language',
    'header.switchTo': 'Tiếng Việt',

    // Footer
    'footer.copyright': '© {year} Minh Tran. All rights reserved.',
    'footer.security': 'Secured with HTTPS | GDPR Compliant | Privacy-First Analytics',
    'footer.learnMore': 'Learn More',
    'footer.email': 'Email',
    'footer.linkedin': 'LinkedIn',
    'footer.github': 'GitHub',
    'footer.securityPage': 'Security',
    'months.short.1': 'Jan',
    'months.short.2': 'Feb',
    'months.short.3': 'Mar',
    'months.short.4': 'Apr',
    'months.short.5': 'May',
    'months.short.6': 'Jun',
    'months.short.7': 'Jul',
    'months.short.8': 'Aug',
    'months.short.9': 'Sep',
    'months.short.10': 'Oct',
    'months.short.11': 'Nov',
    'months.short.12': 'Dec',

    // Common
    'common.readMore': 'Read more',
    'common.loading': 'Loading...',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',

    // Home Page
    //'home.hero.name': 'Tran Thi Minh Tran',
    //'home.hero.tagline': 'Operations & Digital Transformation | Unilever | Completing EMBA',
    //'home.hero.description': 'Welcome to my little garden. Here, I share my professional story as it is raw, real, and completely unvarnished...',
    'home.hero.viewProjects': 'Building Legacy',
    'home.hero.aboutMe': 'About Me',
    
//'header.home': 'The Garden',
//'header.about': 'The Growth',
//'header.projects': 'Building Legacy',
//'header.blog': 'Lesson Learned',
//'header.contact': 'Say Hello',
    
//  'home.hero.downloadCV': 'Download CV',
//  'home.hero.loadingCV': 'Loading...',
//  'home.values.title1': 'Systems Thinking',
//  'home.values.desc1': 'Two decades of seeing how supply chains, teams, and technology interconnect',
//  'home.values.title2': 'Human-Centered',
//    'home.values.desc2': 'Technology serves people, not the other way around — this belief guides every decision I make',
//    'home.values.title3': 'Quiet Ambition',
//    'home.values.desc3': 'Building something meaningful in the next chapter, one step at a time',
//    'home.featured.projects': 'Featured Projects',
//    'home.featured.projectsPlaceholder': 'Projects coming soon... Building in progress! 🚀',
//    'home.featured.latestPosts': 'Latest Posts',
//    'home.featured.postsPlaceholder': 'Blog posts coming soon... Stay tuned! ✍️',

    // Garden Story Section
    //'home.origin.title': 'About This Garden',
    //'home.origin.act1': 'LinkedIn is the gate; this is the garden. A quiet corner to breathe, to write, and to uncover the path ahead after two decades of corporate life.',
    //'home.origin.act2.intro': 'A question I keep returning to:',
    //'home.origin.act2.question': 'What does it mean to build something that truly matters?',
    //'home.origin.act3.intro': 'After leading digital transformation across Vietnam, Thailand, and the Philippines for Unilever, I find myself at an inflection point — curious, energized, and ready.',
    //'home.origin.act3.closing': 'This garden is where I figure out the next chapter. You\'re welcome to walk through it.',

    // About Page
    //'about.title': 'Who I Am',
    //'about.subtitle': '20 years of digital leadership at Unilever Greater Asia',
    //'about.photo': 'Photo',
    //'about.name': 'Minh Tran',
    //'about.role': 'Head of Digital & Technology | Supply Chain | EMBA UQAM×UEH ISB',
    //'about.intro': 'Head of Digital & Technology Consulting for Supply Chain across Greater Asia (Vietnam, Thailand, Philippines) at Unilever. 20 years building digital capability at scale. EMBA from UQAM×UEH ISB. Now exploring the next chapter — potentially as COO or Co-founder of something new.',
    //'about.journey.title': 'Professional Journey',
    //'about.education.title': 'Education & Expertise',
    //'about.education.subtitle': 'Education',
    //'about.education.mba': 'MBA - Business in IT, University of Technology Sydney (UTS), Australia (2001-2003)',
    //'about.education.bachelor': 'Bachelor of Commerce - Economics & Finance, Macquarie University, Australia (1997-2001)',
    //'about.education.diploma': 'Diploma of Commerce - Business Economics, Insearch Institute, Australia (1996-1997)',
    //'about.currentFocus.title': 'Current Focus',
    //'about.currentFocus.ai': 'AI learner and practitioner (AI chatbots, AI apps, AI Agents with n8n)',
    //'about.currentFocus.pm': 'Product Management transition',
    //'about.currentFocus.team': 'Team management & leadership',
    //'about.currentFocus.sap': 'SAP ERP systems',
    //'about.currentFocus.itsm': 'IT Service Management',
    //'about.training.title': 'Training & Development',
    //'about.competencies.title': 'Core Competencies',
    //'about.competency.integrity': 'Integrity',
    //'about.competency.respect': 'Respect Others',
    //'about.competency.accountability': 'Accountability',
    //'about.competency.learning': 'Learning Attitude',
    //'about.competency.english': 'Excellent English Communication',
    //'about.competency.leadership': 'Team Leadership',
    //'about.beyond.title': 'Beyond Work',
    //'about.beyond.bio': 'Born March 9, 1975. Married, Vietnamese national living in District 3, HCMC.',
    //'about.beyond.interests': "When I'm not working on IT solutions or learning about AI, you'll find me running or traveling. I believe in continuous learning and challenging myself with new opportunities. My 20 years of experience across diverse industries has taught me that the best solutions come from understanding people first, then applying technology.",

    // Projects Page
    'projects.title': 'Building Legacy',
    'projects.subtitle': `I'm not looking for the next step on a career ladder. I'm looking for a place where I can truly make a difference and stay to see the results flourish. I am open to: COO · Co-founder · or Building something new from the ground up.`,
    //'projects.empty': 'We are a good fit if you need a partner to build values with a human-centric heart and a foundation built on continuous learning.We might not be a match if you view change as a risk to be avoided, or if you prioritize static stability over growth-driven evolution.',
    //'projects.emptySubtitle': 'I am open to: COO · Co-founder · or Building something new from the ground up.',
    'projects.backToProjects': '← Back to Projects',
//    'projects.viewGithub': 'View on GitHub',
//    'projects.liveDemo': 'Live Demo',
//    'projects.keyLearnings': 'Key Learnings',
//    'projects.relatedProjects': 'Related Projects',
//    'projects.screenshots': 'Screenshots',
//    'projects.viewCode': 'View Code',

        // Blog Page
    'blog.title': 'Blog',
    'blog.subtitle': 'Through these chapters of reflection, you will gain a deeper insight into how I think, the experiences that shaped those thoughts, and the core values I stand for.',
    'blog.empty': 'First essays coming soon...',
    'blog.emptySubtitle': 'Working as a bee...',
    'blog.backToBlog': '← Back to My Lesson Learned',
    'blog.minRead': 'min read',
    'blog.thanks': 'Thanks for reading! If you found this helpful, feel free to reach out on',
    'blog.linkedin': 'LinkedIn',
    
    // Contact Page
    'contact.title': 'Say Hello',
    'contact.subtitle': 'Have a question or want to work together? Feel free to reach out!',
    'contact.email.label': 'Email',
    'contact.linkedin.label': 'LinkedIn',
    'contact.linkedin.description': 'Connect with me',
    'contact.github.label': 'GitHub',
    'contact.github.description': 'View my code',

    // Security Page
    'security.title': 'Security & Privacy',
    'security.subtitle': 'We take the security and privacy of your data seriously. This page outlines the measures implemented to protect your information.',
    'security.lastUpdated': 'Last Updated: April 2026',
    'security.commitment.title': 'Our Commitment to Security',
    'security.commitment.description': 'We implement industry-standard security practices to ensure your data is protected at all times. Our website is secured with HTTPS encryption, rate limiting, and comprehensive input validation.',
    'security.features.title': 'Security Features',
    'security.dataProtection.title': '1. Data Protection',
    'security.dataProtection.https': 'Encrypted Connections: All data transmitted between your browser and our servers is encrypted using HTTPS/TLS.',
    'security.dataProtection.noPersonal': 'No Personal Data Collection: This website does not collect or store personal information (names, emails, phone numbers).',
    'security.dataProtection.storage': 'Secure Storage: All data is stored in encrypted databases with appropriate retention policies.',
    'security.rateLimiting.title': '2. Rate Limiting & Abuse Prevention',
    'security.rateLimiting.api': 'API Rate Limiting: Requests are limited to prevent spam and abuse.',
    'security.rateLimiting.admin': 'Admin Protection: Login attempts limited to 5 per 15 minutes with automatic lockout.',
    'security.rateLimiting.upload': 'File Upload Limits: Maximum 5 uploads per 10 minutes to prevent storage abuse.',
    'security.inputValidation.title': '3. Input Validation',
    'security.inputValidation.xss': 'XSS Prevention: All user input is sanitized to prevent cross-site scripting attacks.',
    'security.inputValidation.fileType': 'File Type Validation: Only safe file types (PDF, DOCX, TXT) are allowed for uploads.',
    'security.inputValidation.form': 'Form Input Limits: All form inputs are validated and length-limited.',
    'security.dataCollection.title': 'What Data We Collect',
    'security.dataCollection.noPersonal.title': 'No Personal Identification',
    'security.dataCollection.noPersonal.description': 'We do not collect:',
    'security.dataCollection.noPersonal.names': 'Names',
    'security.dataCollection.noPersonal.email': 'Email addresses (except for admin login)',
    'security.dataCollection.noPersonal.phone': 'Phone numbers',
    'security.dataCollection.noPersonal.ip': 'IP addresses (used only for rate limiting, not stored long-term)',
    'security.dataCollection.noPersonal.location': 'Location data',
    'security.thirdParty.title': 'Third-Party Services',
    'security.thirdParty.description': 'We use the following trusted third-party services:',
    'security.thirdParty.service': 'Service',
    'security.thirdParty.purpose': 'Purpose',
    'security.thirdParty.dataShared': 'Data Shared',
    'security.thirdParty.vercel': 'Website hosting',
    'security.thirdParty.vercel.data': 'None (infrastructure only)',
    'security.thirdParty.upstash': 'Data storage',
    'security.thirdParty.upstash.data': 'Content and configuration',
    'security.gdpr.title': 'GDPR Compliance',
    'security.gdpr.access.title': 'Right to Access',
    'security.gdpr.access.description': 'Request a copy of your data',
    'security.gdpr.deletion.title': 'Right to Deletion',
    'security.gdpr.deletion.description': 'Request deletion of your data',
    'security.gdpr.object.title': 'Right to Object',
    'security.gdpr.object.description': 'Opt-out of data collection',
    'security.gdpr.minimization.title': 'Data Minimization',
    'security.gdpr.minimization.description': "We only collect what's necessary",
    'security.incident.title': 'Security Incident Response',
    'security.incident.description': 'If you discover a security vulnerability, please report it to:',
    'security.incident.email': 'Email:',
    'security.incident.willDo': 'We will:',
    'security.incident.acknowledge': 'Acknowledge your report within 24 hours',
    'security.incident.investigate': 'Investigate and confirm the issue',
    'security.incident.patch': 'Patch the vulnerability within 7 days (critical) or 30 days (non-critical)',
    'security.incident.notify': 'Notify affected users if necessary',
    'security.compliance.title': 'Compliance & Certifications',
    'security.compliance.https': 'HTTPS/TLS Encryption - All connections encrypted',
    'security.compliance.owasp': 'OWASP Top 10 Protection - Mitigated common vulnerabilities',
    'security.compliance.gdpr': 'GDPR Compliant - User data rights respected',
    'security.compliance.audits': 'Regular Security Audits - Quarterly reviews',
    'security.footer.contact': 'For security or privacy questions, contact:',
    'security.footer.audit': 'Last Security Audit: November 2025 | Next Scheduled Audit: February 2026',
    'security.footer.updated': 'This page is updated regularly. Last update: November 2025',
  },
  vi: {
    // Header Navigation
    'header.home': 'Khu Vườn',
    'header.about': 'Chuyện Khởi Đầu',
    'header.projects': 'Kiến Tạo Giá Trị',
    'header.blog': 'Góc Suy Gẫm',
    'header.contact': 'Kết nối',
    'header.admin': 'Admin',
    'header.language': 'Ngôn ngữ',
    'header.switchTo': 'English',

    // Footer
    'footer.copyright': '© {year} Minh Tran. Bảo lưu mọi quyền.',
    'footer.security': 'Bảo mật HTTPS | Tuân thủ GDPR | Phân tích riêng tư',
    'footer.learnMore': 'Tìm hiểu thêm',
    'footer.email': 'Email',
    'footer.linkedin': 'LinkedIn',
    'footer.github': 'GitHub',
    'footer.securityPage': 'Bảo mật',
    'months.short.1': 'Th1',
    'months.short.2': 'Th2',
    'months.short.3': 'Th3',
    'months.short.4': 'Th4',
    'months.short.5': 'Th5',
    'months.short.6': 'Th6',
    'months.short.7': 'Th7',
    'months.short.8': 'Th8',
    'months.short.9': 'Th9',
    'months.short.10': 'Th10',
    'months.short.11': 'Th11',
    'months.short.12': 'Th12',

    // Common
    'common.readMore': 'Đọc thêm',
    'common.loading': 'Đang tải...',
    'common.back': 'Quay lại',
    'common.next': 'Tiếp theo',
    'common.previous': 'Trước đó',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.sort': 'Sắp xếp',

    // Home Page
    'home.hero.name': 'TRAN',
    'home.hero.tagline': 'Operations & Digital Transformation | Unilever | Completing EMBA',
    'home.hero.description': 'Chào mừng bạn đến với khu vườn Vercel nhỏ của mình, nơi mình ghi lại hành trình nghề nghiệp bằng tất cả sự chân thành, mộc mạc, không tô vẽ hay phô trương...',
    'home.hero.viewProjects': 'Kiến tạo giá trị',
    'home.hero.aboutMe': 'Câu chuyện của tôi',
    
    //'home.hero.tagline': 'Trưởng phòng Công nghệ & Chuyển đổi số | Supply Chain',
    //'home.hero.description': 'Chào mừng bạn đến khu vườn nhỏ của tôi. 20 năm xây dựng năng lực số cho Unilever Greater Asia. Đang bước vào chương mới — tìm kiếm điều gì đó để xây dựng tiếp.',
    //'home.hero.viewProjects': 'Xem dự án',
    //'home.hero.aboutMe': 'Giới thiệu',
    //'home.hero.downloadCV': 'Tải CV',
    //'home.hero.loadingCV': 'Đang tải...',
    //'home.values.title1': 'Tư duy hệ thống',
    //'home.values.desc1': 'Hai thập kỷ nhìn thấy chuỗi cung ứng, con người và công nghệ kết nối với nhau như thế nào',
    //'home.values.title2': 'Lấy con người làm trung tâm',
    //'home.values.desc2': 'Công nghệ phục vụ con người, không phải ngược lại — niềm tin này dẫn dắt mọi quyết định',
    //'home.values.title3': 'Tham vọng lặng lẽ',
    //'home.values.desc3': 'Xây dựng điều gì đó có ý nghĩa trong chương tiếp theo, từng bước một',
    //'home.featured.projects': 'Dự án nổi bật',
    //'home.featured.projectsPlaceholder': 'Dự án sắp ra mắt... Đang xây dựng! 🚀',
    //'home.featured.latestPosts': 'Bài viết mới nhất',
    //'home.featured.postsPlaceholder': 'Blog sắp ra mắt... Hãy đón chờ! ✍️',

    // Garden Story Section
    'home.origin.title': 'Về khu vườn này',
    'home.origin.act1': 'Hãy hình dung LinkedIn chính là cái cổng đã dẫn bạn đến khu vườn của tôi, đây là không gian tĩnh lặng hơn để tôi viết mọi thứ cách thật nhất và khám phá điều gì đến tiếp theo sau 20 năm trong môi trường doanh nghiệp.',
    'home.origin.act2.intro': 'Điều lòng tôi đang cưu mang chính là...:',
    'home.origin.act2.question': 'Xây dựng điều gì đó thực sự có ý nghĩa cho cộng đồng người Việt Nam, vậy điều đó trông như thế nào?',
    //'home.origin.act3.intro': 'Sau khi lãnh đạo chuyển đổi số chuỗi cung ứng tại Việt Nam, Thái Lan và Philippines cho Unilever, tôi đang đứng trước một ngã rẽ — tò mò, đầy năng lượng và sẵn sàng.',
   // 'home.origin.act3.closing': 'Khu vườn này là nơi tôi tìm ra chương tiếp theo. Bạn hãy cứ thoải mái dạo qua.',

    // About Page
    //'about.title': 'Tôi là ai',
    //'about.subtitle': '20 năm lãnh đạo số tại Unilever Greater Asia',
    //'about.photo': 'Ảnh',
    //'about.name': 'Minh Tran',
    //'about.role': 'Trưởng phòng Công nghệ & Chuyển đổi số | Supply Chain | EMBA UQAM×UEH ISB',
    //'about.intro': 'Trưởng phòng Tư vấn Công nghệ & Chuyển đổi số chuỗi cung ứng Greater Asia (Việt Nam, Thái Lan, Philippines) tại Unilever. 20 năm xây dựng năng lực số ở quy mô lớn. EMBA từ UQAM×UEH ISB. Đang khám phá chương tiếp theo — có thể là COO hoặc Co-founder của điều gì đó mới.',
    //'about.journey.title': 'Hành trình nghề nghiệp',
    //'about.education.title': 'Học vấn & Chuyên môn',
    //'about.education.subtitle': 'Học vấn',
    //'about.education.mba': 'MBA - Kinh doanh trong IT, Đại học Công nghệ Sydney (UTS), Úc (2001-2003)',
    //'about.education.bachelor': 'Cử nhân Thương mại - Kinh tế & Tài chính, Đại học Macquarie, Úc (1997-2001)',
    //'about.education.diploma': 'Văn bằng Thương mại - Kinh tế Kinh doanh, Viện Insearch, Úc (1996-1997)',
    //'about.currentFocus.title': 'Định hướng hiện tại',
    //'about.currentFocus.ai': 'Học viên và thực hành AI (AI chatbots, ứng dụng AI, AI Agents với n8n)',
    //'about.currentFocus.pm': 'Chuyển đổi sang Product Management',
    //'about.currentFocus.team': 'Quản lý đội nhóm & lãnh đạo',
    //'about.currentFocus.sap': 'Hệ thống SAP ERP',
    //'about.currentFocus.itsm': 'Quản lý Dịch vụ IT',
    //'about.training.title': 'Đào tạo & Phát triển',
    //'about.competencies.title': 'Năng lực cốt lõi',
    //'about.competency.integrity': 'Chính trực',
    //'about.competency.respect': 'Tôn trọng người khác',
    //'about.competency.accountability': 'Trách nhiệm',
    //'about.competency.learning': 'Thái độ học hỏi',
    //'about.competency.english': 'Giao tiếp tiếng Anh xuất sắc',
    //'about.competency.leadership': 'Lãnh đạo đội nhóm',
    //'about.beyond.title': 'Ngoài công việc',
    //'about.beyond.bio': 'Sinh ngày 9/3/1975. Đã kết hôn, quốc tịch Việt Nam, sống tại Quận 3, TP.HCM.',
    //'about.beyond.interests': 'Khi không làm việc với các giải pháp IT hoặc học về AI, bạn sẽ thấy tôi chạy bộ hoặc du lịch. Tôi tin vào việc học hỏi liên tục và thử thách bản thân với những cơ hội mới. 20 năm kinh nghiệm qua nhiều ngành khác nhau đã dạy tôi rằng giải pháp tốt nhất đến từ việc hiểu con người trước, sau đó mới áp dụng công nghệ.',

    // Projects Page
    'projects.title': 'Kiến tạo giá trị',
    'projects.subtitle': 'Tôi không tìm kiếm một nấc thang tiếp theo cho sự nghiệp. Tôi tìm một nơi mình thực sự có thể giúp sức và muốn ở lại đủ lâu để nhìn thấy những mùa gặt thành quả. Các hình thức tôi đang mở lòng: COO · Co-founder · hoặc cùng xây dựng một điều gì đó mới mẻ từ đầu.',
    'projects.empty': 'Chúng ta sẽ là những người đồng hành phù hợp nếu bạn cần một đối tác cùng xây dựng những giá trị lấy con người làm gốc rễ, đặt sự học hỏi làm nền tảng.Chúng ta có thể không hợp nếu bạn xem thay đổi là rủi ro cần tránh, hoặc coi trọng sự ổn định hơn là sự chuyển mình để phát triển.',
    'projects.emptySubtitle': 'Các hình thức tôi đang mở lòng: COO · Co-founder · hoặc cùng xây dựng một điều gì đó mới mẻ từ đầu.',
    'projects.backToProjects': '← Quay lại',
    //'projects.viewGithub': 'Xem trên GitHub',
    //'projects.liveDemo': 'Demo trực tiếp',
    //'projects.keyLearnings': 'Bài học quan trọng',
    //'projects.relatedProjects': 'Dự án liên quan',
    //'projects.screenshots': 'Hình ảnh',
    //'projects.viewCode': 'Xem mã nguồn',


    // Blog Page
    'blog.title': 'Góc suy ngẫm',
    'blog.subtitle': 'Qua các chương của góc suy ngẫm này, bạn sẽ thấy những nét phác họa rõ hơn về cách tôi tư duy, những điều đã tôi luyện nên góc nhìn ấy, và những giá trị cốt lõi mà tôi hằng tin tưởng',
    'blog.empty': 'Những bài viết đầu tiên sắp ra mắt...',
    'blog.emptySubtitle': 'Cố gắng chờ thêm chút nữa nhé...',
    'blog.backToBlog': '← Quay lại Góc Suy Ngẫm',
    'blog.minRead': 'phút đọc',
    'blog.thanks': 'Cảm ơn bạn đã dành thời gian cho Góc Suy Ngẫm của mình! Nếu bạn thấy hữu ích, hãy kết nối cùng tôi',
    'blog.linkedin': 'LinkedIn',




    // Contact Page
    'contact.title': 'Liên hệ',
    'contact.subtitle': 'Hãy liên hệ tôi nếu bạn muốn chúng ta làm việc cùng nhau!',
    'contact.email.label': 'Email',
    'contact.linkedin.label': 'LinkedIn',
    'contact.linkedin.description': 'Kết nối với tôi',
    'contact.github.label': 'GitHub',
    'contact.github.description': 'Xem code của tôi',

    // Security Page
    'security.title': 'Bảo mật & Quyền riêng tư',
    'security.subtitle': 'Chúng tôi coi trọng bảo mật và quyền riêng tư dữ liệu của bạn. Trang này mô tả các biện pháp đã triển khai để bảo vệ thông tin của bạn.',
    'security.lastUpdated': 'Cập nhật lần cuối: Tháng 11, 2025',
    'security.commitment.title': 'Cam kết bảo mật',
    'security.commitment.description': 'Chúng tôi triển khai các phương pháp bảo mật tiêu chuẩn ngành để đảm bảo dữ liệu của bạn luôn được bảo vệ. Website được bảo mật bằng mã hóa HTTPS, giới hạn tốc độ và xác thực đầu vào toàn diện.',
    'security.features.title': 'Tính năng bảo mật',
    'security.dataProtection.title': '1. Bảo vệ dữ liệu',
    'security.dataProtection.https': 'Kết nối được mã hóa: Tất cả dữ liệu truyền giữa trình duyệt và máy chủ được mã hóa bằng HTTPS/TLS.',
    'security.dataProtection.noPersonal': 'Không thu thập dữ liệu cá nhân: Website không thu thập hoặc lưu trữ thông tin cá nhân (tên, email, số điện thoại).',
    'security.dataProtection.storage': 'Lưu trữ an toàn: Dữ liệu được lưu trong cơ sở dữ liệu mã hóa với chính sách lưu trữ phù hợp.',
    'security.rateLimiting.title': '2. Giới hạn tốc độ & Ngăn chặn lạm dụng',
    'security.rateLimiting.api': 'Giới hạn API: Các yêu cầu được giới hạn để ngăn spam và lạm dụng.',
    'security.rateLimiting.admin': 'Bảo vệ Admin: Giới hạn 5 lần đăng nhập/15 phút với khóa tự động.',
    'security.rateLimiting.upload': 'Giới hạn Upload: Tối đa 5 file/10 phút để ngăn lạm dụng lưu trữ.',
    'security.inputValidation.title': '3. Xác thực đầu vào',
    'security.inputValidation.xss': 'Ngăn chặn XSS: Tất cả đầu vào được làm sạch để ngăn tấn công cross-site scripting.',
    'security.inputValidation.fileType': 'Xác thực loại file: Chỉ cho phép các loại file an toàn (PDF, DOCX, TXT).',
    'security.inputValidation.form': 'Giới hạn form: Tất cả đầu vào biểu mẫu được xác thực và giới hạn độ dài.',
    'security.dataCollection.title': 'Dữ liệu chúng tôi thu thập',
    'security.dataCollection.noPersonal.title': 'Không định danh cá nhân',
    'security.dataCollection.noPersonal.description': 'Chúng tôi không thu thập:',
    'security.dataCollection.noPersonal.names': 'Tên',
    'security.dataCollection.noPersonal.email': 'Địa chỉ email (trừ admin login)',
    'security.dataCollection.noPersonal.phone': 'Số điện thoại',
    'security.dataCollection.noPersonal.ip': 'Địa chỉ IP (chỉ dùng để giới hạn tốc độ, không lưu dài hạn)',
    'security.dataCollection.noPersonal.location': 'Dữ liệu vị trí',
    'security.thirdParty.title': 'Dịch vụ bên thứ ba',
    'security.thirdParty.description': 'Chúng tôi sử dụng các dịch vụ đáng tin cậy sau:',
    'security.thirdParty.service': 'Dịch vụ',
    'security.thirdParty.purpose': 'Mục đích',
    'security.thirdParty.dataShared': 'Dữ liệu chia sẻ',
    'security.thirdParty.vercel': 'Hosting website',
    'security.thirdParty.vercel.data': 'Không có (chỉ hạ tầng)',
    'security.thirdParty.upstash': 'Lưu trữ dữ liệu',
    'security.thirdParty.upstash.data': 'Nội dung và cấu hình',
    'security.gdpr.title': 'Tuân thủ GDPR',
    'security.gdpr.access.title': 'Quyền truy cập',
    'security.gdpr.access.description': 'Yêu cầu bản sao dữ liệu của bạn',
    'security.gdpr.deletion.title': 'Quyền xóa',
    'security.gdpr.deletion.description': 'Yêu cầu xóa dữ liệu',
    'security.gdpr.object.title': 'Quyền phản đối',
    'security.gdpr.object.description': 'Từ chối thu thập dữ liệu',
    'security.gdpr.minimization.title': 'Tối thiểu hóa dữ liệu',
    'security.gdpr.minimization.description': 'Chỉ thu thập những gì cần thiết',
    'security.incident.title': 'Phản ứng sự cố bảo mật',
    'security.incident.description': 'Nếu phát hiện lỗ hổng bảo mật, vui lòng báo cáo tới:',
    'security.incident.email': 'Email:',
    'security.incident.willDo': 'Chúng tôi sẽ:',
    'security.incident.acknowledge': 'Xác nhận báo cáo trong 24 giờ',
    'security.incident.investigate': 'Điều tra và xác nhận vấn đề',
    'security.incident.patch': 'Vá lỗ hổng trong 7 ngày (nghiêm trọng) hoặc 30 ngày (không nghiêm trọng)',
    'security.incident.notify': 'Thông báo cho người dùng bị ảnh hưởng nếu cần',
    'security.compliance.title': 'Tuân thủ & Chứng chỉ',
    'security.compliance.https': 'Mã hóa HTTPS/TLS - Tất cả kết nối được mã hóa',
    'security.compliance.owasp': 'Bảo vệ OWASP Top 10 - Giảm thiểu lỗ hổng phổ biến',
    'security.compliance.gdpr': 'Tuân thủ GDPR - Tôn trọng quyền dữ liệu người dùng',
    'security.compliance.audits': 'Kiểm tra bảo mật định kỳ - Hàng quý',
    'security.footer.contact': 'Câu hỏi về bảo mật hoặc quyền riêng tư, liên hệ:',
    'security.footer.audit': 'Kiểm tra bảo mật lần cuối: Tháng 11/2025 | Kiểm tra tiếp theo: Tháng 2/2026',
    'security.footer.updated': 'Trang này được cập nhật thường xuyên. Cập nhật lần cuối: Tháng 11/2025',
  },
}

/**
 * Language Provider Component
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'vi')) {
      setLanguageState(saved)
    }
  }, [])

  // Save to localStorage when language changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  // Translation function with dynamic variable replacement
  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations['en']]
    return translation || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Custom hook to use Language Context
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
