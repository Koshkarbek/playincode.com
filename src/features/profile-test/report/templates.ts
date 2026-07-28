import type { ProfileKey } from "../types";
import {
  COMPETENCY_KEYS,
  LEARNING_STYLE_KEYS,
  OBSERVATION_KEYS,
  SUPPORT_KEYS,
  type CourseDirection,
  type ProfileReportTemplate,
  type ReportLocale,
  type StudentReportDraft,
} from "./types";

const t = (ru: string, en: string) => ({ ru, en });

const common = {
  A: {
    profileDescription: t(
      "Ребёнок предпочитает последовательность, понятную структуру и возможность спокойно разобраться в задаче. Обычно внимательно относится к деталям и стремится понять логику решения.",
      "The student prefers clear structure, a steady sequence, and enough time to understand a task. They usually pay close attention to detail and want to understand the logic behind a solution.",
    ),
    strengths: {
      ru: ["Логическое мышление", "Внимательность к деталям", "Последовательность"],
      en: ["Logical thinking", "Attention to detail", "Consistency"],
    },
    development: {
      ru: ["Гибкость при изменении плана", "Уверенность в экспериментировании"],
      en: ["Flexibility when plans change", "Confidence with experimentation"],
    },
    taskFormat: t(
      "Структурированные многоэтапные проекты с понятной целью и возможностью самостоятельно проверить результат.",
      "Structured, multi-step projects with a clear goal and an opportunity to verify the result independently.",
    ),
    feedback: t(
      "Указать область ошибки, не давая готового ответа, и дать время самостоятельно найти исправление.",
      "Point to the area containing the error without giving the final answer, then allow time to find the fix independently.",
    ),
    attention: t(
      "Снижать лишний шум, не торопить и предлагать задачи с постепенно возрастающей сложностью.",
      "Reduce unnecessary distractions, avoid rushing, and offer tasks with gradually increasing difficulty.",
    ),
  },
  B: {
    profileDescription: t(
      "Ребёнок лучше раскрывается через творчество, визуальные образы и свободу выбора. Яркие идеи и возможность сделать проект по-своему поддерживают интерес к обучению.",
      "The student engages best through creativity, visual ideas, and freedom of choice. Original ideas and room for personal expression sustain their interest in learning.",
    ),
    strengths: {
      ru: ["Креативность", "Нестандартные идеи", "Визуальное мышление"],
      en: ["Creativity", "Original ideas", "Visual thinking"],
    },
    development: {
      ru: ["Доведение проекта до конца", "Структурирование идей"],
      en: ["Finishing projects", "Structuring ideas"],
    },
    taskFormat: t(
      "Творческие проекты с выбором темы, персонажей и оформления при сохранении понятных этапов работы.",
      "Creative projects with a choice of theme, characters, and visual style while keeping clear milestones.",
    ),
    feedback: t(
      "Превращать ошибку в творческую задачу и предлагать несколько способов изменить или улучшить результат.",
      "Turn an error into a creative challenge and offer several ways to change or improve the result.",
    ),
    attention: t(
      "Дробить теорию на короткие блоки и менять вид деятельности каждые 10–15 минут.",
      "Break theory into short sections and vary the activity every 10–15 minutes.",
    ),
  },
  C: {
    profileDescription: t(
      "Ребёнок ориентирован на действие и быстрый практический результат. Лучше всего учится через самостоятельные попытки, эксперименты и заметный прогресс.",
      "The student is action-oriented and motivated by quick, practical results. They learn best through hands-on attempts, experimentation, and visible progress.",
    ),
    strengths: {
      ru: ["Практичность", "Скорость включения", "Настойчивость"],
      en: ["Practical thinking", "Quick engagement", "Persistence"],
    },
    development: {
      ru: ["Планирование решения", "Внимательная проверка результата"],
      en: ["Planning a solution", "Careful result checking"],
    },
    taskFormat: t(
      "Короткие практические задания, игровые вызовы и быстрый переход от объяснения к написанию кода.",
      "Short hands-on tasks, game-like challenges, and a quick transition from explanation to coding.",
    ),
    feedback: t(
      "Подавать ошибку как челлендж, сначала предложить проверить гипотезу и только затем дать направляющую подсказку.",
      "Present the error as a challenge, first invite the student to test a hypothesis, and only then provide a guiding hint.",
    ),
    attention: t(
      "Минимум длинной теории, больше практики, короткие цели и видимый результат на каждом этапе.",
      "Use minimal lengthy theory, more practice, short goals, and a visible result at every stage.",
    ),
  },
  D: {
    profileDescription: t(
      "Ребёнку важны взаимодействие, поддержка и возможность обсуждать решение вслух. В партнёрском формате легче сохраняет уверенность и вовлечённость.",
      "The student values interaction, support, and opportunities to discuss solutions aloud. A collaborative format helps sustain confidence and engagement.",
    ),
    strengths: {
      ru: ["Коммуникация", "Открытость к обратной связи", "Командное мышление"],
      en: ["Communication", "Openness to feedback", "Collaborative thinking"],
    },
    development: {
      ru: ["Самостоятельный старт", "Уверенность без постоянной поддержки"],
      en: ["Independent task initiation", "Confidence without constant support"],
    },
    taskFormat: t(
      "Парное программирование, обсуждение шагов вслух и проекты с регулярной обратной связью наставника.",
      "Pair programming, thinking aloud, and projects with regular mentor feedback.",
    ),
    feedback: t(
      "Использовать мягкую схему «сильная сторона — корректировка — поддержка» и обсуждать исправление вместе.",
      "Use a gentle strength-correction-support structure and discuss the fix together.",
    ),
    attention: t(
      "Поддерживать голосовой контакт, задавать вопросы и включать короткие совместные обсуждения.",
      "Maintain verbal contact, ask questions, and include short collaborative discussions.",
    ),
  },
} as const;

function pureTemplate(
  key: keyof typeof common,
  title: { ru: string; en: string },
): ProfileReportTemplate {
  const source = common[key];
  return {
    profileTitle: title,
    profileDescription: source.profileDescription,
    lessonSummary: t(
      `Во время пробного занятия ученик проявил интерес к практической работе. Наблюдения показали особенности профиля «${title.ru.toLowerCase()}»: ребёнку важно получать задания в подходящем темпе и формате. Сильные стороны можно использовать как опору для освоения программирования, а зоны развития — постепенно укреплять в проектной работе.`,
      `During the trial lesson, the student showed interest in hands-on work. The observations reflected the “${title.en}” learning profile: the student benefits from tasks presented at an appropriate pace and in a suitable format. Their strengths can support progress in programming, while development areas can be strengthened gradually through project work.`,
    ),
    strengths: {
      ru: [...source.strengths.ru],
      en: [...source.strengths.en],
    },
    development: {
      ru: [...source.development.ru],
      en: [...source.development.en],
    },
    opportunities: {
      ru: ["Создание собственных проектов", "Постепенное усложнение технических задач"],
      en: ["Creating original projects", "Gradually increasing technical challenge"],
    },
    risks: {
      ru: ["Снижение интереса при неподходящем формате", "Нерегулярная практика"],
      en: ["Reduced interest when the format is unsuitable", "Irregular practice"],
    },
    learningStyles:
      key === "A"
        ? ["stepByStep", "problems", "repetition"]
        : key === "B"
          ? ["projects", "visuals", "experimentation"]
          : key === "C"
            ? ["practice", "shortTasks", "gameFormat"]
            : ["discussion", "practice", "projects"],
    supportNeeds:
      key === "A"
        ? ["pace", "confidence"]
        : key === "B"
          ? ["planning", "finishing", "selfChecking"]
          : key === "C"
            ? ["focus", "planning", "selfChecking"]
            : ["taskStart", "confidence", "debugging"],
    taskFormat: source.taskFormat,
    feedback: source.feedback,
    attention: source.attention,
    conclusion: t(
      `По результатам пробного занятия профиль «${title.ru}» показывает хороший потенциал для изучения программирования. Наиболее эффективным станет формат, который учитывает индивидуальный темп ребёнка и опирается на его сильные стороны. Регулярная проектная практика поможет развивать технические навыки, самостоятельность и уверенность в решении новых задач.`,
      `The trial lesson indicates that the “${title.en}” profile has strong potential for learning programming. The most effective format will respect the student’s individual pace and build on their strengths. Regular project-based practice will help develop technical skills, independence, and confidence when solving new problems.`,
    ),
  };
}

function mixedTemplate(
  left: keyof typeof common,
  right: keyof typeof common,
  title: { ru: string; en: string },
  description: { ru: string; en: string },
): ProfileReportTemplate {
  const first = common[left];
  const second = common[right];
  return {
    profileTitle: title,
    profileDescription: description,
    lessonSummary: t(
      `Во время пробного занятия проявились особенности смешанного профиля «${title.ru.toLowerCase()}». Ребёнок сочетает ${first.strengths.ru[0].toLowerCase()} и ${second.strengths.ru[0].toLowerCase()}, поэтому лучше всего раскрывается в заданиях, где можно использовать обе стороны профиля. Индивидуальный темп и регулярная практика помогут закрепить интерес и перейти к более сложным проектам.`,
      `The trial lesson reflected the mixed “${title.en}” profile. The student combines ${first.strengths.en[0].toLowerCase()} with ${second.strengths.en[0].toLowerCase()}, and therefore engages best in tasks that use both sides of the profile. An individual pace and regular practice will help sustain interest and support progress toward more advanced projects.`,
    ),
    strengths: {
      ru: [first.strengths.ru[0], second.strengths.ru[0], "Сочетание разных способов решения"],
      en: [first.strengths.en[0], second.strengths.en[0], "Combining different solution strategies"],
    },
    development: {
      ru: [first.development.ru[0], second.development.ru[0]],
      en: [first.development.en[0], second.development.en[0]],
    },
    opportunities: {
      ru: ["Создание самостоятельных проектов", "Развитие гибкого подхода к задачам"],
      en: ["Building independent projects", "Developing a flexible approach to problems"],
    },
    risks: {
      ru: ["Потеря интереса без практического результата", "Перегрузка при неподходящем темпе"],
      en: ["Losing interest without a practical result", "Overload when the pace is unsuitable"],
    },
    learningStyles: Array.from(
      new Set([
        ...(left === "A" ? ["stepByStep", "problems", "repetition"] : left === "B" ? ["projects", "visuals", "experimentation"] : left === "C" ? ["practice", "shortTasks", "gameFormat"] : ["discussion", "practice", "projects"]),
        ...(right === "A" ? ["stepByStep", "problems", "repetition"] : right === "B" ? ["projects", "visuals", "experimentation"] : right === "C" ? ["practice", "shortTasks", "gameFormat"] : ["discussion", "practice", "projects"]),
      ]),
    ).slice(0, 4) as ProfileReportTemplate["learningStyles"],
    supportNeeds: Array.from(
      new Set([
        ...(left === "C" || right === "C" ? ["focus", "planning", "selfChecking"] : []),
        ...(left === "D" || right === "D" ? ["taskStart", "confidence"] : []),
        ...(left === "A" || right === "A" ? ["pace"] : []),
        ...(left === "B" || right === "B" ? ["finishing", "selfChecking"] : []),
      ]),
    ).slice(0, 4) as ProfileReportTemplate["supportNeeds"],
    taskFormat: t(
      `${first.taskFormat.ru} Дополнительно важно учитывать вторую сторону профиля: ${second.taskFormat.ru.toLowerCase()}`,
      `${first.taskFormat.en} It is also important to support the second side of the profile: ${second.taskFormat.en.toLowerCase()}`,
    ),
    feedback: t(
      `${first.feedback.ru} При необходимости дополнить подход: ${second.feedback.ru.toLowerCase()}`,
      `${first.feedback.en} When appropriate, complement this approach by ${second.feedback.en.toLowerCase()}`,
    ),
    attention: t(
      `${first.attention.ru} Также полезно: ${second.attention.ru.toLowerCase()}`,
      `${first.attention.en} It is also helpful to ${second.attention.en.toLowerCase()}`,
    ),
    conclusion: t(
      `Профиль «${title.ru}» показывает хороший потенциал для обучения через проекты, сочетающие разные способы мышления. Программа должна опираться на сильные стороны ребёнка, сохранять понятную структуру и давать достаточно пространства для практики. Такой формат поможет развивать технические навыки, самостоятельность и уверенность.`,
      `The “${title.en}” profile shows strong potential for project-based learning that combines different ways of thinking. The program should build on the student’s strengths, maintain clear structure, and provide enough room for practice. This approach will support technical skills, independence, and confidence.`,
    ),
  };
}

export const REPORT_TEMPLATES: Record<ProfileKey, ProfileReportTemplate> = {
  A: pureTemplate("A", t("Вдумчивый архитектор", "Thoughtful Architect")),
  B: pureTemplate("B", t("Креативный хакер", "Creative Hacker")),
  C: pureTemplate("C", t("Неутомимый тестировщик", "Relentless Tester")),
  D: pureTemplate("D", t("Командный разработчик", "Team Developer")),
  AB: mixedTemplate("A", "B", t("Инженер-изобретатель", "Inventor Engineer"), t(
    "Ребёнок сочетает системное мышление с ярким воображением: умеет придумывать необычные идеи и лучше раскрывается, когда творческий замысел получает понятную структуру.",
    "The student combines systematic thinking with imagination: they generate original ideas and engage best when a creative concept is supported by clear structure.",
  )),
  AC: mixedTemplate("A", "C", t("DevOps-оптимизатор", "DevOps Optimizer"), t(
    "Ребёнок соединяет понимание логики с желанием быстро увидеть практический результат. Ему подходят короткие циклы: разобраться, реализовать и сразу проверить.",
    "The student combines logical understanding with a desire to see practical results quickly. Short cycles of understanding, building, and immediate testing work well.",
  )),
  AD: mixedTemplate("A", "D", t("Техлид", "Tech Lead"), t(
    "Ребёнок способен мыслить последовательно и при этом хорошо раскрывается в диалоге. Обсуждение архитектуры и объяснение решений усиливают понимание.",
    "The student can think systematically and also engages well through dialogue. Discussing structure and explaining solutions deepens understanding.",
  )),
  BC: mixedTemplate("B", "C", t("Инди-разработчик", "Indie Developer"), t(
    "Ребёнок быстро превращает творческие идеи в работающие прототипы. Интерес поддерживают свобода эксперимента, заметный результат и короткие практические этапы.",
    "The student quickly turns creative ideas into working prototypes. Freedom to experiment, visible results, and short practical stages sustain engagement.",
  )),
  BD: mixedTemplate("B", "D", t("Геймдизайнер", "Game Designer"), t(
    "Ребёнок любит придумывать миры, персонажей и обсуждать идеи. Совместное проектирование помогает превратить воображение в законченный цифровой проект.",
    "The student enjoys inventing worlds and characters and discussing ideas. Collaborative design helps turn imagination into a complete digital project.",
  )),
  CD: mixedTemplate("C", "D", t("Скрам-мастер", "Scrum Master"), t(
    "Ребёнок энергично включается в практику и нуждается в регулярном взаимодействии. Короткие задачи и обсуждение результата помогают удерживать рабочий ритм.",
    "The student engages energetically in hands-on work and benefits from regular interaction. Short tasks and result discussions help maintain momentum.",
  )),
  AMBIGUOUS: {
    profileTitle: t("Индивидуальный смешанный профиль", "Individual Mixed Profile"),
    profileDescription: t(
      "Ответы теста не выделяют один или два ведущих типа. Поэтому рекомендации уточняются по поведению ребёнка на пробном уроке и не ограничиваются одной моделью обучения.",
      "The test responses do not identify one or two leading types. Recommendations are therefore refined through observations from the trial lesson rather than limited to a single learning model.",
    ),
    lessonSummary: t(
      "Во время пробного занятия ребёнок проявил индивидуальное сочетание учебных предпочтений. Результат теста не выделяет один ведущий профиль, поэтому основой рекомендаций стали фактические наблюдения преподавателя. На следующих занятиях важно продолжить проверять разные форматы задач и закрепить те, которые дают лучшую вовлечённость и результат.",
      "During the trial lesson, the student showed an individual combination of learning preferences. The test does not identify one dominant profile, so the recommendations rely primarily on the teacher’s observations. Future lessons should continue testing different task formats and reinforce those that produce the strongest engagement and results.",
    ),
    strengths: {
      ru: ["Гибкость учебных предпочтений", "Потенциал в разных форматах"],
      en: ["Flexible learning preferences", "Potential across different formats"],
    },
    development: {
      ru: ["Определение устойчивого рабочего темпа", "Формирование самостоятельной стратегии"],
      en: ["Finding a sustainable working pace", "Building an independent strategy"],
    },
    opportunities: {
      ru: ["Проверка разных направлений", "Персональная программа по наблюдениям"],
      en: ["Exploring different directions", "A personalized program based on observation"],
    },
    risks: {
      ru: ["Слишком ранняя фиксация на одном формате", "Нерегулярная практика"],
      en: ["Choosing one format too early", "Irregular practice"],
    },
    learningStyles: ["practice", "projects", "visuals", "discussion"],
    supportNeeds: ["debugging", "planning", "focus"],
    taskFormat: t(
      "Чередовать практические, визуальные и логические задания, отмечая фактическую вовлечённость и самостоятельность.",
      "Alternate hands-on, visual, and logical tasks while observing actual engagement and independence.",
    ),
    feedback: t(
      "Использовать конкретную обратную связь по действиям ребёнка и проверять, какой объём подсказок помогает двигаться самостоятельно.",
      "Use specific feedback about the student’s actions and observe how much guidance supports independent progress.",
    ),
    attention: t(
      "Менять формат небольшими блоками и фиксировать, какие задачи лучше всего удерживают внимание.",
      "Vary the format in short blocks and note which tasks sustain attention most effectively.",
    ),
    conclusion: t(
      "Результаты показывают потенциал для изучения программирования без жёсткой привязки к одному стилю. Индивидуальная программа должна уточняться по наблюдениям на следующих занятиях, сочетая практику, понятную структуру и пространство для самостоятельных решений.",
      "The results indicate strong potential for learning programming without limiting the student to one style. The individual program should be refined through observations in future lessons, combining practice, clear structure, and room for independent decisions.",
    ),
  },
};

export const REPORT_LABELS = {
  competencies: {
    interest: t("Интерес к обучению", "Interest in learning"),
    logic: t("Логическое мышление", "Logical thinking"),
    independence: t("Самостоятельность", "Independence"),
    focus: t("Концентрация внимания", "Attention and focus"),
    communication: t("Коммуникация", "Communication"),
    creativity: t("Креативность", "Creativity"),
  },
  observations: {
    active: t("Активно участвовал в работе", "Participated actively"),
    questions: t("Не боялся задавать вопросы", "Was comfortable asking questions"),
    initiative: t("Проявлял инициативу", "Showed initiative"),
    quickLearning: t("Быстро осваивал новый материал", "Learned new material quickly"),
    practice: t("С интересом выполнял практические задания", "Engaged with practical tasks"),
    sustainedFocus: t(
      "Сохранял концентрацию во время задания",
      "Maintained focus during the task",
    ),
    independentAttempts: t(
      "Пробовал найти решение самостоятельно",
      "Tried to find a solution independently",
    ),
    acceptsFeedback: t(
      "Спокойно воспринимал обратную связь",
      "Responded positively to feedback",
    ),
    explainsThinking: t(
      "Объяснял ход своих мыслей",
      "Explained their thinking process",
    ),
    checksResult: t(
      "Проверял результат после выполнения",
      "Checked the result after completing the task",
    ),
  },
  learningStyles: {
    practice: t("Через практику", "Through hands-on practice"),
    projects: t("Через создание проектов", "Through project creation"),
    visuals: t("Через визуальные примеры", "Through visual examples"),
    problems: t("Через решение задач", "Through problem solving"),
    stepByStep: t(
      "Через пошаговые инструкции",
      "Through step-by-step instructions",
    ),
    gameFormat: t("Через игровой формат", "Through game-based learning"),
    shortTasks: t("Через короткие задания", "Through short tasks"),
    discussion: t(
      "Через обсуждение и объяснение вслух",
      "Through discussion and thinking aloud",
    ),
    experimentation: t(
      "Через эксперименты и свободный поиск",
      "Through experimentation and exploration",
    ),
    repetition: t(
      "Через повторение и закрепление",
      "Through repetition and reinforcement",
    ),
  },
  supportNeeds: {
    longInstructions: t("При работе с длинными инструкциями", "With long instructions"),
    debugging: t("При поиске ошибок", "When debugging"),
    planning: t("При планировании решения", "When planning a solution"),
    focus: t(
      "При длительной концентрации",
      "When maintaining focus for a long time",
    ),
    taskStart: t(
      "При самостоятельном начале задания",
      "When starting a task independently",
    ),
    finishing: t(
      "При доведении проекта до конца",
      "When completing a project",
    ),
    pace: t(
      "При работе в ограниченном темпе",
      "When working under time pressure",
    ),
    theory: t(
      "При изучении теоретического материала",
      "When learning theoretical material",
    ),
    confidence: t(
      "При столкновении со сложной задачей",
      "When facing a difficult task",
    ),
    selfChecking: t(
      "При самостоятельной проверке результата",
      "When checking a result independently",
    ),
  },
  directions: {
    scratch: "Scratch",
    roblox: "Roblox Studio",
    python: "Python",
  } satisfies Record<CourseDirection, string>,
};

export function createEmptyReport(
  profileKey: ProfileKey,
  locale: ReportLocale,
): StudentReportDraft {
  return {
    locale,
    profileKey,
    studentName: "",
    age: "",
    direction: "roblox",
    lessonDate: new Date().toISOString().slice(0, 10),
    teacherName: "",
    lessonSummary: "",
    competencies: Object.fromEntries(
      COMPETENCY_KEYS.map((key) => [key, 3]),
    ) as StudentReportDraft["competencies"],
    observations: Object.fromEntries(
      OBSERVATION_KEYS.map((key) => [key, false]),
    ) as StudentReportDraft["observations"],
    observationNote: "",
    swot: { strengths: [], development: [], opportunities: [], risks: [] },
    learningStyles: Object.fromEntries(
      LEARNING_STYLE_KEYS.map((key) => [key, false]),
    ) as StudentReportDraft["learningStyles"],
    supportNeeds: Object.fromEntries(
      SUPPORT_KEYS.map((key) => [key, false]),
    ) as StudentReportDraft["supportNeeds"],
    conclusion: "",
  };
}

export function applyTemplate(
  draft: StudentReportDraft,
  locale: ReportLocale = draft.locale,
): StudentReportDraft {
  const template = REPORT_TEMPLATES[draft.profileKey];
  return {
    ...draft,
    locale,
    lessonSummary: template.lessonSummary[locale],
    swot: {
      strengths: [...template.strengths[locale]],
      development: [...template.development[locale]],
      opportunities: [...template.opportunities[locale]],
      risks: [...template.risks[locale]],
    },
    learningStyles: Object.fromEntries(
      LEARNING_STYLE_KEYS.map((key) => [
        key,
        template.learningStyles.includes(key),
      ]),
    ) as StudentReportDraft["learningStyles"],
    supportNeeds: Object.fromEntries(
      SUPPORT_KEYS.map((key) => [
        key,
        template.supportNeeds.includes(key),
      ]),
    ) as StudentReportDraft["supportNeeds"],
    conclusion: template.conclusion[locale],
  };
}

export function hasAuthoredContent(draft: StudentReportDraft): boolean {
  return Boolean(
    draft.lessonSummary.trim() ||
      draft.observationNote.trim() ||
      draft.conclusion.trim() ||
      Object.values(draft.observations).some(Boolean) ||
      Object.values(draft.learningStyles).some(Boolean) ||
      Object.values(draft.supportNeeds).some(Boolean) ||
      Object.values(draft.swot).some((items) => items.length > 0),
  );
}
