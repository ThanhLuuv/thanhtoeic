import { Question } from '../types';

export const questions: Record<string, Question[]> = {
  classify: [
    {
      sentence: "He was watching TV when the phone rang.",
      options: ["Past Simple", "Past Continuous", "Present Perfect", "Future Continuous"],
      correct: 1,
      hint: "Cấu trúc 'was + V-ing' và 'when the phone rang' cho thấy hành động đang diễn ra trong quá khứ bị gián đoạn."
    },
    {
      sentence: "The Earth revolves around the Sun.",
      options: ["Present Simple", "Present Continuous", "Future Simple", "Past Simple"],
      correct: 0,
      hint: "Câu này diễn tả một sự thật hiển nhiên, không thay đổi, dùng thì Present Simple."
    },
    {
      sentence: "They will have finished the project by Friday.",
      options: ["Future Simple", "Future Perfect", "Present Perfect", "Past Perfect"],
      correct: 1,
      hint: "Cấu trúc 'will have + V3' và 'by Friday' chỉ hành động hoàn thành trước một thời điểm trong tương lai."
    },
    {
      sentence: "She has just completed her assignment.",
      options: ["Present Simple", "Present Perfect", "Past Simple", "Present Continuous"],
      correct: 1,
      hint: "'Has just + V3' là dấu hiệu của thì Present Perfect, diễn tả hành động vừa mới hoàn thành."
    },
    {
      sentence: "We were studying all night for the exam.",
      options: ["Past Simple", "Past Continuous", "Present Perfect", "Future Continuous"],
      correct: 1,
      hint: "Cấu trúc 'were + V-ing' và 'all night' chỉ hành động kéo dài trong quá khứ."
    },
    {
      sentence: "The bus arrives at 7 PM daily.",
      options: ["Present Simple", "Present Continuous", "Future Simple", "Past Simple"],
      correct: 0,
      hint: "Lịch trình cố định, như thời gian xe buýt, được diễn tả bằng thì Present Simple."
    },
    {
      sentence: "I will be traveling to Japan next month.",
      options: ["Future Simple", "Future Continuous", "Present Continuous", "Past Continuous"],
      correct: 1,
      hint: "Cấu trúc 'will be + V-ing' và 'next month' chỉ hành động đang diễn ra tại một thời điểm trong tương lai."
    },
    {
      sentence: "He had already left when I arrived.",
      options: ["Past Simple", "Present Perfect", "Past Perfect", "Future Perfect"],
      correct: 2,
      hint: "Cấu trúc 'had + V3' và 'when I arrived' chỉ hành động hoàn thành trước một thời điểm trong quá khứ."
    },
    {
      sentence: "She is writing a letter to her friend now.",
      options: ["Present Simple", "Present Continuous", "Past Continuous", "Future Continuous"],
      correct: 1,
      hint: "'Now' và cấu trúc 'is + V-ing' chỉ hành động đang diễn ra tại thời điểm nói."
    },
    {
      sentence: "It rains heavily in the monsoon season.",
      options: ["Present Simple", "Present Continuous", "Future Simple", "Past Simple"],
      correct: 0,
      hint: "Câu này diễn tả một hiện tượng tự nhiên xảy raburden ra thường xuyên, dùng thì Present Simple."
    }
  ],
  choice: [
    {
      sentence: "They _____ to the concert tomorrow evening.",
      options: ["go", "went", "will go", "have gone"],
      correct: 2,
      hint: "'Tomorrow evening' là thời gian tương lai, dùng cấu trúc 'will + V'."
    },
    {
      sentence: "The dog _____ in the garden right now.",
      options: ["plays", "played", "is playing", "has played"],
      correct: 2,
      hint: "'Right now' cho thấy hành động đang diễn ra tại thời điểm nói, dùng thì Present Continuous."
    },
    {
      sentence: "She _____ her homework last night.",
      options: ["does", "did", "has done", "is doing"],
      correct: 1,
      hint: "'Last night' là thời gian quá khứ, dùng thì Past Simple."
    },
    {
      sentence: "We _____ this movie before.",
      options: ["see", "saw", "have seen", "are seeing"],
      correct: 2,
      hint: "'Before' và cấu trúc 'have + V3' chỉ hành động đã xảy ra trong quá khứ và liên quan đến hiện tại."
    },
    {
      sentence: "The meeting _____ at 10 AM tomorrow.",
      options: ["starts", "started", "will start", "is starting"],
      correct: 0,
      hint: "Lịch trình cố định, như giờ họp, dùng thì Present Simple."
    },
    {
      sentence: "He _____ in this city since 2015.",
      options: ["lives", "lived", "has lived", "is living"],
      correct: 2,
      hint: "'Since 2015' chỉ hành động bắt đầu trong quá khứ và kéo dài đến hiện tại, dùng thì Present Perfect."
    },
    {
      sentence: "I _____ a new phone next week.",
      options: ["buy", "bought", "will buy", "have bought"],
      correct: 2,
      hint: "'Next week' là thời gian tương lai, dùng 'will + V'."
    },
    {
      sentence: "They _____ when the storm started.",
      options: ["dance", "danced", "were dancing", "have danced"],
      correct: 2,
      hint: "Hành động đang diễn ra trong quá khứ bị gián đoạn bởi sự kiện khác, dùng thì Past Continuous."
    },
    {
      sentence: "The sun _____ at 6 AM tomorrow.",
      options: ["rises", "rose", "will rise", "is rising"],
      correct: 0,
      hint: "Hiện tượng tự nhiên cố định, như mặt trời mọc, dùng thì Present Simple."
    },
    {
      sentence: "She _____ her keys yet.",
      options: ["doesn’t find", "didn’t find", "hasn’t found", "won’t find"],
      correct: 2,
      hint: "'Yet' thường dùng với thì Present Perfect để chỉ hành động chưa hoàn thành."
    }
  ],
  structure: [
    {
      sentence: "He apologized me for his mistake.",
      options: ["Subject", "Verb", "Preposition", "Object"],
      correct: 2,
      hint: "Sau 'apologized' cần có giới từ 'to' - apologized to me."
    },
    {
      sentence: "They are afraid make mistakes.",
      options: ["Subject", "Verb", "Preposition", "Gerund"],
      correct: 2,
      hint: "Sau 'afraid' cần có giới từ 'of' - afraid of making mistakes."
    },
    {
      sentence: "The teacher told the students be quiet.",
      options: ["Subject", "Verb", "Infinitive", "Object"],
      correct: 2,
      hint: "Sau 'told' + object, cần 'to' + infinitive - told the students to be quiet."
    },
    {
      sentence: "This book is worth to read.",
      options: ["Subject", "Verb", "Preposition", "Gerund"],
      correct: 3,
      hint: "Sau 'worth' cần dùng danh động từ (V-ing) - worth reading."
    },
    {
      sentence: "She is good playing the piano.",
      options: ["Subject", "Verb", "Preposition", "Gerund"],
      correct: 2,
      hint: "Sau 'good' cần có giới từ 'at' - good at playing the piano."
    },
    {
      sentence: "He persuaded me join the club.",
      options: ["Subject", "Verb", "Infinitive", "Object"],
      correct: 2,
      hint: "Sau 'persuaded' + object, cần 'to' + infinitive - persuaded me to join."
    },
    {
      sentence: "The movie is capable making you cry.",
      options: ["Subject", "Verb", "Preposition", "Gerund"],
      correct: 2,
      hint: "Sau 'capable' cần có giới từ 'of' - capable of making you cry."
    },
    {
      sentence: "I look forward meet you soon.",
      options: ["Subject", "Verb", "Preposition", "Gerund"],
      correct: 3,
      hint: "Sau 'look forward to' cần dùng danh động từ - look forward to meeting."
    },
    {
      sentence: "She accused him steal her idea.",
      options: ["Subject", "Verb", "Preposition", "Gerund"],
      correct: 2,
      hint: "Sau 'accused' + object, cần 'of' + gerund - accused him of stealing."
    },
    {
      sentence: "The job requires you work overtime.",
      options: ["Subject", "Verb", "Infinitive", "Object"],
      correct: 2,
      hint: "Sau 'requires' + object, cần 'to' + infinitive - requires you to work."
    }
  ]
};