import type {
  BaseType,
  Locale,
  LocalizedText,
  ProfileContent,
  ProfileKey,
  Question,
} from "./types.ts";

const t = (ru: string, en: string): LocalizedText => ({ ru, en });

export const questions: Question[] = [
  {
    id: 1,
    prompt: t(
      "Тебе подарили новую игру или конструктор. Как начнёшь?",
      "You received a new game or construction set. How will you start?",
    ),
    answers: {
      A: t("Строго по инструкции.", "I’ll follow the instructions carefully."),
      B: t("Придумаю свою постройку.", "I’ll invent my own creation."),
      C: t("Соединю детали наугад.", "I’ll connect pieces at random."),
      D: t("Позову собирать вместе.", "I’ll ask someone to build it with me."),
    },
  },
  {
    id: 2,
    prompt: t(
      "Не можешь пройти босса в игре уже десятый раз. Твои действия?",
      "You have failed to beat a game boss ten times. What will you do?",
    ),
    answers: {
      A: t("Найду гайд в интернете.", "I’ll find a guide online."),
      B: t("Включу другую игру.", "I’ll switch to another game."),
      C: t("Буду пробовать снова и снова.", "I’ll keep trying again and again."),
      D: t("Попрошу кого-то помочь.", "I’ll ask someone for help."),
    },
  },
  {
    id: 3,
    prompt: t(
      "Учитель задал сложный проект. Как будешь работать?",
      "Your teacher assigned a difficult project. How will you work on it?",
    ),
    answers: {
      A: t("Одному в тишине.", "On my own, somewhere quiet."),
      B: t(
        "Сделаю только творческую часть.",
        "I’ll focus only on the creative part.",
      ),
      C: t("Начну делать быстрее всех.", "I’ll try to start before everyone else."),
      D: t("Вместе с командой.", "Together with a team."),
    },
  },
  {
    id: 4,
    prompt: t(
      "Ты сделал код или поделку, но там ошибка. Как отреагируешь?",
      "You made some code or a craft project, but there is a mistake. How will you react?",
    ),
    answers: {
      A: t(
        "Внимательно проверю каждый шаг.",
        "I’ll carefully check every step.",
      ),
      B: t(
        "Оставлю как есть — это фича!",
        "I’ll leave it as it is—it’s a feature!",
      ),
      C: t("Буду менять всё наугад.", "I’ll change things at random."),
      D: t("Сразу попрошу помощи.", "I’ll ask for help right away."),
    },
  },
  {
    id: 5,
    prompt: t(
      "У тебя два часа свободного времени. Чем займёшься?",
      "You have two hours of free time. What will you do?",
    ),
    answers: {
      A: t(
        "Буду читать или строить базу.",
        "I’ll read or build up a game base.",
      ),
      B: t(
        "Придумаю свою игру или комикс.",
        "I’ll invent my own game or comic.",
      ),
      C: t(
        "Пойду активно бегать и играть.",
        "I’ll run around and play something active.",
      ),
      D: t("Позвоню друзьям поболтать.", "I’ll call my friends for a chat."),
    },
  },
  {
    id: 6,
    prompt: t(
      "Вы играете в настольную игру, и правила кажутся скучными. Что сделаешь?",
      "You are playing a board game and the rules seem boring. What will you do?",
    ),
    answers: {
      A: t(
        "Буду играть строго по правилам.",
        "I’ll follow the rules exactly.",
      ),
      B: t(
        "Придумаю свои безумные правила!",
        "I’ll invent my own wild rules!",
      ),
      C: t("Найду лазейку для победы.", "I’ll find a loophole to win."),
      D: t(
        "Соглашусь, чтобы никто не ссорился.",
        "I’ll go along with everyone so nobody argues.",
      ),
    },
  },
  {
    id: 7,
    prompt: t(
      "Как ты лучше всего запоминаешь новое?",
      "How do you remember new things best?",
    ),
    answers: {
      A: t(
        "Через чёткие схемы и списки.",
        "Through clear diagrams and lists.",
      ),
      B: t(
        "Через яркие картинки и истории.",
        "Through vivid pictures and stories.",
      ),
      C: t(
        "Когда сам пробую сделать руками.",
        "When I try doing it myself.",
      ),
      D: t("Когда обсуждаю это вслух.", "When I discuss it out loud."),
    },
  },
  {
    id: 8,
    prompt: t(
      "У тебя сломалась любимая игрушка. Что сделаешь?",
      "Your favorite toy has broken. What will you do?",
    ),
    answers: {
      A: t(
        "Аккуратно разберу и починю.",
        "I’ll carefully take it apart and fix it.",
      ),
      B: t(
        "Сделаю из деталей что-то новое.",
        "I’ll make something new from the pieces.",
      ),
      C: t(
        "Буду трясти и нажимать кнопки.",
        "I’ll shake it and press all the buttons.",
      ),
      D: t(
        "Попрошу родителей помочь.",
        "I’ll ask my parents to help.",
      ),
    },
  },
  {
    id: 9,
    prompt: t(
      "Пишешь сложное сочинение. Что труднее всего?",
      "You are writing a difficult essay. What is the hardest part?",
    ),
    answers: {
      A: t(
        "Писать без чёткого плана.",
        "Writing without a clear plan.",
      ),
      B: t(
        "Писать на скучную тему — хочу свою!",
        "Writing about a boring topic—I want to choose my own!",
      ),
      C: t(
        "Долго сидеть на одном месте.",
        "Sitting still for a long time.",
      ),
      D: t(
        "Начать без поддержки учителя.",
        "Getting started without the teacher’s support.",
      ),
    },
  },
  {
    id: 10,
    prompt: t(
      "Ты сделал крутой проект. Какая похвала приятнее?",
      "You made an awesome project. Which compliment would you like most?",
    ),
    answers: {
      A: t(
        "«Всё логично и без ошибок!»",
        "“Everything is logical and error-free!”",
      ),
      B: t(
        "«Очень оригинально и необычно!»",
        "“It’s so original and unusual!”",
      ),
      C: t(
        "«Ты справился быстрее всех!»",
        "“You finished faster than everyone else!”",
      ),
      D: t(
        "«Было здорово работать с тобой!»",
        "“It was great working with you!”",
      ),
    },
  },
  {
    id: 11,
    prompt: t(
      "На уроке стало скучно. Что делаешь?",
      "The lesson has become boring. What do you do?",
    ),
    answers: {
      A: t("Внимательно слушаю дальше.", "I keep listening carefully."),
      B: t(
        "Рисую в тетради или фантазирую.",
        "I draw in my notebook or daydream.",
      ),
      C: t(
        "Качаюсь на стуле, отвлекаюсь.",
        "I rock in my chair and get distracted.",
      ),
      D: t("Переписываюсь с друзьями.", "I message my friends."),
    },
  },
  {
    id: 12,
    prompt: t(
      "Как ты относишься к подсказкам от учителя?",
      "How do you feel about hints from your teacher?",
    ),
    answers: {
      A: t(
        "Пусть только укажут на ошибку.",
        "I only want them to point out the mistake.",
      ),
      B: t(
        "Не люблю, они мешают фантазировать.",
        "I don’t like hints—they get in the way of my ideas.",
      ),
      C: t("Хочу всё решить сам.", "I want to solve everything myself."),
      D: t(
        "Обожаю подсказки, так спокойнее.",
        "I love hints—they make me feel more confident.",
      ),
    },
  },
  {
    id: 13,
    prompt: t(
      "Что самое главное в любой игре?",
      "What matters most in any game?",
    ),
    answers: {
      A: t(
        "Развивать базу и персонажа.",
        "Building up my base and character.",
      ),
      B: t(
        "Создавать свои миры и образы.",
        "Creating my own worlds and character looks.",
      ),
      C: t("Экшен, битвы и победа!", "Action, battles, and winning!"),
      D: t(
        "Общение с друзьями в чате.",
        "Chatting with my friends.",
      ),
    },
  },
  {
    id: 14,
    prompt: t(
      "Заметил кривую деталь в самом низу своей постройки. Что сделаешь?",
      "You notice a crooked piece at the bottom of your construction. What will you do?",
    ),
    answers: {
      A: t(
        "Разберу половину и исправлю.",
        "I’ll take half of it apart and fix it.",
      ),
      B: t(
        "Оставлю так, будто это задумка.",
        "I’ll leave it and pretend it was intentional.",
      ),
      C: t("Впихну деталь силой.", "I’ll force the piece into place."),
      D: t(
        "Спрошу совета, что делать.",
        "I’ll ask someone what I should do.",
      ),
    },
  },
  {
    id: 15,
    prompt: t(
      "Каким супергероем ты бы стал?",
      "What kind of superhero would you be?",
    ),
    answers: {
      A: t(
        "С супер-мозгом, как Бэтмен.",
        "A hero with a super-brain, like Batman.",
      ),
      B: t(
        "Создающим миры и иллюзии.",
        "A hero who creates worlds and illusions.",
      ),
      C: t(
        "С суперсилой или скоростью.",
        "A hero with super strength or speed.",
      ),
      D: t(
        "Читающим мысли и лечащим.",
        "A hero who reads minds and heals people.",
      ),
    },
  },
];

export const profiles: Record<ProfileKey, ProfileContent> = {
  A: {
    key: "A",
    title: t("Вдумчивый архитектор", "Thoughtful Architect"),
    sections: [
      {
        label: t("Как хвалить", "How to praise"),
        text: t(
          "За внимательность к деталям, чистый код, логику и самостоятельность. Например: «Твой алгоритм работает безупречно, ты отлично оптимизировал код».",
          "Praise attention to detail, clean code, logic, and independence. For example: “Your algorithm works perfectly—you optimized the code really well.”",
        ),
      },
      {
        label: t("Обратная связь при ошибках", "Feedback on mistakes"),
        text: t(
          "Укажите блок, где есть ошибка, но не давайте готовое решение. Позвольте ребёнку найти ошибку самостоятельно.",
          "Point out the block containing the mistake, but do not give the finished solution. Let the child find the bug independently.",
        ),
      },
      {
        label: t("Удержание внимания", "Keeping attention"),
        text: t(
          "Давайте сложные многоуровневые задачи со звёздочкой. Не торопите, снижайте количество интерактива и шума, создавайте условия для глубокого фокуса.",
          "Offer difficult, multi-stage challenge tasks. Do not rush the child; reduce noise and unnecessary interaction so they can focus deeply.",
        ),
      },
    ],
  },
  B: {
    key: "B",
    title: t("Креативный хакер", "Creative Hacker"),
    sections: [
      {
        label: t("Как хвалить", "How to praise"),
        text: t(
          "За нестандартный подход, идеи и визуальную часть. Например: «Какая крутая механика! Никто до этого не додумался».",
          "Praise unusual approaches, ideas, and visual work. For example: “That is such a cool mechanic! Nobody else thought of that.”",
        ),
      },
      {
        label: t("Обратная связь при ошибках", "Feedback on mistakes"),
        text: t(
          "Превращайте исправление ошибки в творческую задачу: «Персонаж летит сквозь стену. Как изменить код, чтобы стена стала батутом?»",
          "Turn fixing a mistake into a creative task: “Your character flies through the wall. How could we change the code so the wall becomes a trampoline?”",
        ),
      },
      {
        label: t("Удержание внимания", "Keeping attention"),
        text: t(
          "Дробите теорию на короткие части, разрешайте менять цвета, персонажей и сюжет. Если становится скучно, меняйте вид деятельности каждые 10–15 минут.",
          "Break theory into short pieces and allow customization of colors, characters, and stories. If attention drops, change the activity every 10–15 minutes.",
        ),
      },
    ],
  },
  C: {
    key: "C",
    title: t("Неутомимый тестировщик", "Relentless Tester"),
    sections: [
      {
        label: t("Как хвалить", "How to praise"),
        text: t(
          "За скорость, упорство и преодоление трудностей. Например: «Ты сделал это! Я знал, что ты справишься с этим сложным уровнем».",
          "Praise speed, persistence, and overcoming challenges. For example: “You did it! I knew you could beat this difficult level.”",
        ),
      },
      {
        label: t("Обратная связь при ошибках", "Feedback on mistakes"),
        text: t(
          "Подавайте ошибку как игровой вызов: «Система выдала ошибку! Давай устроим челлендж и найдём неработающую строку».",
          "Present mistakes as game challenges: “The system found an error! Let’s make it a challenge and find the broken line.”",
        ),
      },
      {
        label: t("Удержание внимания", "Keeping attention"),
        text: t(
          "Минимум теории, максимум практики. Используйте таймеры и соревнования, позволяйте писать код руками с первой минуты.",
          "Use minimal theory and maximum practice. Add timers and friendly competitions, and let the child write code from the first minute.",
        ),
      },
    ],
  },
  D: {
    key: "D",
    title: t("Командный разработчик", "Team Developer"),
    sections: [
      {
        label: t("Как хвалить", "How to praise"),
        text: t(
          "За старания, командный дух и процесс. Например: «Мне нравится, как мы сегодня поработали. Ты задавал отличные вопросы!»",
          "Praise effort, teamwork, and the process. For example: “I really liked how we worked today. You asked excellent questions!”",
        ),
      },
      {
        label: t("Обратная связь при ошибках", "Feedback on mistakes"),
        text: t(
          "Используйте мягкую схему «похвала — замечание — поддержка» и говорите «мы»: «Здесь у нас небольшая опечатка. Давай исправим её вместе».",
          "Use a gentle “praise—correction—support” approach and say “we”: “We have a small typo here. Let’s fix it together.”",
        ),
      },
      {
        label: t("Удержание внимания", "Keeping attention"),
        text: t(
          "Поддерживайте зрительный и голосовой контакт, просите рассуждать вслух и превращайте урок в тёплое партнёрское общение.",
          "Maintain visual and verbal contact, invite the child to think aloud, and make the lesson feel like a warm partnership.",
        ),
      },
    ],
  },
  AB: {
    key: "AB",
    title: t("Инженер-изобретатель", "Inventor Engineer"),
    sections: [
      {
        label: t("Характеристика", "Characteristics"),
        text: t(
          "Придумывает нестандартные идеи, но умеет доводить их до конца, выстраивая чёткую архитектуру проекта.",
          "Creates unusual ideas and can carry them through by building a clear project architecture.",
        ),
      },
      {
        label: t("Как учить", "How to teach"),
        text: t(
          "Давайте свободу выбора темы, но требуйте аккуратной структуры и чистого кода: «Сделай что-то необычное, но чтобы всё работало без ошибок».",
          "Allow freedom in choosing the project theme while expecting clear structure and clean code: “Make something unusual, but make sure it works without errors.”",
        ),
      },
    ],
  },
  AC: {
    key: "AC",
    title: t("DevOps-оптимизатор", "DevOps Optimizer"),
    sections: [
      {
        label: t("Характеристика", "Characteristics"),
        text: t(
          "Системный подход сочетается с желанием быстро получить практический результат. Любит оптимизировать и автоматизировать.",
          "Combines systematic thinking with a desire for fast, practical results. Enjoys optimization and automation.",
        ),
      },
      {
        label: t("Как учить", "How to teach"),
        text: t(
          "Показывайте логику и сразу давайте применить её на практике: короткая теория, небольшой скрипт, немедленная проверка.",
          "Explain the logic and apply it immediately: a short piece of theory, a small script, and an immediate test.",
        ),
      },
    ],
  },
  AD: {
    key: "AD",
    title: t("Техлид", "Tech Lead"),
    sections: [
      {
        label: t("Характеристика", "Characteristics"),
        text: t(
          "Глубоко и системно мыслит, хорошо взаимодействует с наставником и умеет объяснять сложные вещи простыми словами.",
          "Thinks deeply and systematically, works well with a mentor, and can explain difficult ideas in simple words.",
        ),
      },
      {
        label: t("Как учить", "How to teach"),
        text: t(
          "Общайтесь как с младшим коллегой. Давайте сложные задачи, а затем просите объяснить решение и обсудить архитектуру.",
          "Treat the child like a junior colleague. Give challenging tasks, then ask them to explain the solution and discuss its architecture.",
        ),
      },
    ],
  },
  BC: {
    key: "BC",
    title: t("Инди-разработчик", "Indie Developer"),
    sections: [
      {
        label: t("Характеристика", "Characteristics"),
        text: t(
          "Придумывает много ярких идей и сразу реализует их методом проб и ошибок. Скорость и драйв важнее идеального кода.",
          "Generates many bold ideas and immediately builds them through trial and error. Speed and momentum matter more than perfect code.",
        ),
      },
      {
        label: t("Как учить", "How to teach"),
        text: t(
          "Направляйте энергию без длинной теории. Разрешайте сначала получить работающий результат, а ошибки мягко исправляйте в процессе.",
          "Guide the child’s energy without long theory sessions. Let them get a working result first, then gently correct mistakes along the way.",
        ),
      },
    ],
  },
  BD: {
    key: "BD",
    title: t("Геймдизайнер", "Game Designer"),
    sections: [
      {
        label: t("Характеристика", "Characteristics"),
        text: t(
          "Творческий и общительный ребёнок, который любит придумывать сюжеты, рисовать дизайн и обсуждать идеи.",
          "A creative, social child who enjoys inventing stories, designing visuals, and discussing ideas.",
        ),
      },
      {
        label: t("Как учить", "How to teach"),
        text: t(
          "Пусть урок напоминает творческую планёрку. Вместе придумывайте историю проекта, используя код как инструмент для оживления идей.",
          "Make lessons feel like creative planning sessions. Build the project story together and use code as a tool for bringing ideas to life.",
        ),
      },
    ],
  },
  CD: {
    key: "CD",
    title: t("Скрам-мастер", "Scrum Master"),
    sections: [
      {
        label: t("Характеристика", "Characteristics"),
        text: t(
          "Энергичный практик, которому важны постоянное взаимодействие и действие. Ему трудно долго работать в тишине.",
          "An energetic, hands-on learner who needs frequent interaction and action. Long periods of silent work are difficult.",
        ),
      },
      {
        label: t("Как учить", "How to teach"),
        text: t(
          "Используйте игровые задания, челленджи и парное программирование. Давайте много быстрых небольших задач и эмоционально поддерживайте.",
          "Use game-like tasks, challenges, and pair programming. Offer many quick, small tasks and provide enthusiastic support.",
        ),
      },
    ],
  },
  AMBIGUOUS: {
    key: "AMBIGUOUS",
    title: t("Неоднозначный профиль", "Ambiguous Profile"),
    sections: [
      {
        label: t("Интерпретация", "Interpretation"),
        text: t(
          "Баллы не позволяют однозначно определить один или два ведущих профиля. Используйте подробные ответы и наблюдение педагога для ручной интерпретации.",
          "The scores do not identify one or two leading profiles clearly. Use the detailed answers and the teacher’s observations for manual interpretation.",
        ),
      },
    ],
  },
};

export const answerLabels: Record<Locale, Record<BaseType, string>> = {
  ru: { A: "А", B: "Б", C: "В", D: "Г" },
  en: { A: "A", B: "B", C: "C", D: "D" },
};

export const copy = {
  rootRequired: t(
    "Для прохождения теста нужна персональная ссылка.",
    "A personal link is required to take the test.",
  ),
  chooseLanguage: t("Выберите язык", "Choose a language"),
  question: t("Вопрос", "Question"),
  of: t("из", "of"),
  thankYou: t("СПАСИБО, ЧТО ПРОШЛИ ТЕСТ", "THANK YOU FOR COMPLETING THE TEST"),
  invalidLink: t(
    "Ссылка недействительна. Обратитесь в школу за новой ссылкой.",
    "This link is invalid. Please ask the school for a new link.",
  ),
  loading: t("Загрузка…", "Loading…"),
  retry: t("Повторить", "Try again"),
  networkError: t(
    "Не удалось сохранить ответ. Проверьте подключение и попробуйте ещё раз.",
    "We could not save your answer. Check your connection and try again.",
  ),
};

export function localized(value: LocalizedText, locale: Locale): string {
  return value[locale];
}
