import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  COMPETENCY_KEYS,
  LEARNING_STYLE_KEYS,
  OBSERVATION_KEYS,
  SUPPORT_KEYS,
  type StudentReportDraft,
} from "./types";
import { REPORT_LABELS, REPORT_TEMPLATES } from "./templates";

const GREEN = "#60C849";
const DARK = "#151515";
const MUTED = "#626262";
const LINE = "#D9DDD7";
const PALE = "#EFF8EC";

const styles = StyleSheet.create({
  page: {
    paddingTop: 10,
    paddingRight: 42,
    paddingBottom: 42,
    paddingLeft: 42,
    color: DARK,
    fontFamily: "Manrope",
    fontSize: 9.2,
    lineHeight: 1.42,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 2,
    borderBottomWidth: 2,
    borderBottomColor: GREEN,
  },
  logo: { width: 80, height: 80, objectFit: "contain" },
  brandText: { color: MUTED, fontSize: 12 },
  title: { marginBottom: 18, fontSize: 24, fontWeight: 700, lineHeight: 1.15 },
  section: { marginTop: 13 },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  paragraph: { marginBottom: 6 },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: GREEN,
    backgroundColor: "#F7F8F7",
  },
  metaItem: { width: "50%", marginBottom: 6, paddingRight: 10 },
  label: { color: MUTED, fontSize: 8 },
  value: { marginTop: 1, fontSize: 10.5, fontWeight: 700 },
  profileCard: {
    marginTop: 15,
    padding: 13,
    borderRadius: 5,
    backgroundColor: PALE,
  },
  profileTitle: { marginBottom: 5, color: "#287C18", fontSize: 14, fontWeight: 700 },
  quote: {
    paddingLeft: 11,
    borderLeftWidth: 2,
    borderLeftColor: GREEN,
    color: "#282828",
  },
  competencyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  competencyName: { width: "55%" },
  competencyScore: { width: "8%", fontWeight: 700 },
  scale: { width: "37%", flexDirection: "row", gap: 3 },
  scaleCell: {
    width: 18,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#E1E3E1",
  },
  scaleActive: { backgroundColor: GREEN },
  checklist: { gap: 4 },
  checkRow: { flexDirection: "row", alignItems: "flex-start" },
  check: { width: 14, color: "#287C18", fontWeight: 700 },
  checkText: { flex: 1 },
  swotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  swotCard: {
    width: "48.8%",
    minHeight: 82,
    padding: 10,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 4,
  },
  swotTitle: { marginBottom: 5, fontWeight: 700 },
  bulletRow: { flexDirection: "row", marginBottom: 3 },
  bullet: { width: 10, color: "#287C18", fontWeight: 700 },
  bulletText: { flex: 1 },
  recommendation: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#F7F8F7",
  },
  recommendationTitle: { marginBottom: 3, fontWeight: 700 },
  footer: {
    marginTop: "auto",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#8A8A8A",
    fontSize: 7.5,
  },
});

const copy = {
  ru: {
    documentTitle: "Индивидуальный профиль ученика",
    student: "Имя ученика",
    age: "Возраст",
    direction: "Направление",
    date: "Дата",
    teacher: "Преподаватель",
    lessonSummary: "Итог пробного занятия",
    learningProfile: "Учебный профиль",
    competencies: "Компетенции ученика",
    observations: "Наблюдения преподавателя",
    swot: "Карта развития",
    strengths: "Сильные стороны",
    development: "Зоны развития",
    opportunities: "Возможности",
    risks: "Потенциальные риски",
    learningStyle: "Индивидуальный стиль обучения",
    learnsBest: "Лучше всего воспринимает материал",
    support: "Требует дополнительной поддержки",
    recommendations: "Рекомендации преподавателю",
    taskFormat: "Формат заданий",
    feedback: "Обратная связь при ошибках",
    attention: "Удержание внимания",
    conclusion: "Итоговое заключение",
    private: "Конфиденциальный учебный отчёт",
    page: "Страница",
  },
  en: {
    documentTitle: "Individual Student Profile",
    student: "Student name",
    age: "Age",
    direction: "Direction",
    date: "Date",
    teacher: "Teacher",
    lessonSummary: "Trial lesson summary",
    learningProfile: "Learning profile",
    competencies: "Student competencies",
    observations: "Teacher observations",
    swot: "Development map",
    strengths: "Strengths",
    development: "Development areas",
    opportunities: "Opportunities",
    risks: "Potential risks",
    learningStyle: "Individual learning style",
    learnsBest: "Learns best",
    support: "Needs additional support",
    recommendations: "Recommendations for the teacher",
    taskFormat: "Task format",
    feedback: "Feedback on mistakes",
    attention: "Maintaining attention",
    conclusion: "Final recommendation",
    private: "Confidential learning report",
    page: "Page",
  },
};

function Header({ logoUrl }: { logoUrl: string }) {
  return (
    <View style={styles.header} wrap={false}>
      {/* @react-pdf Image does not expose the HTML alt attribute. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image src={logoUrl} style={styles.logo} />
      <Text style={styles.brandText}>Education should be fun</Text>
    </View>
  );
}

function Footer({
  locale,
  pageNumber,
}: {
  locale: StudentReportDraft["locale"];
  pageNumber: number;
}) {
  const ui = copy[locale];
  return (
    <View style={styles.footer} wrap={false}>
      <Text>{ui.private}</Text>
      <Text>{`${ui.page} ${pageNumber} / 3`}</Text>
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, index) =>
        item.trim() ? (
          <View key={`${item}-${index}`} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item.trim()}</Text>
          </View>
        ) : (
          <View key={`space-${index}`} style={{ height: 4 }} />
        ),
      )}
    </View>
  );
}

export function StudentReportDocument({
  draft,
  logoUrl,
  fontBaseUrl,
}: {
  draft: StudentReportDraft;
  logoUrl: string;
  fontBaseUrl: string;
}) {
  Font.register({
    family: "Manrope",
    fonts: [
      { src: `${fontBaseUrl}/manrope-regular.ttf`, fontWeight: 400 },
      { src: `${fontBaseUrl}/manrope-bold.ttf`, fontWeight: 700 },
    ],
  });
  const ui = copy[draft.locale];
  const template = REPORT_TEMPLATES[draft.profileKey];
  const locale = draft.locale;
  const selectedObservations = OBSERVATION_KEYS.filter(
    (key) => draft.observations[key],
  );
  const selectedStyles = LEARNING_STYLE_KEYS.filter(
    (key) => draft.learningStyles[key],
  );
  const selectedSupport = SUPPORT_KEYS.filter(
    (key) => draft.supportNeeds[key],
  );

  return (
    <Document
      title={`${ui.documentTitle} — ${draft.studentName}`}
      author="PlayInCode"
      subject={template.profileTitle[locale]}
    >
      <Page size="A4" style={styles.page}>
        <Header logoUrl={logoUrl} />
        <Text style={styles.title}>{ui.documentTitle}</Text>
        <View style={styles.metaGrid}>
          {[
            [ui.student, draft.studentName],
            [ui.age, draft.age],
            [ui.direction, REPORT_LABELS.directions[draft.direction]],
            [ui.date, draft.lessonDate],
            [ui.teacher, draft.teacherName],
          ].map(([label, value]) => (
            <View key={label} style={styles.metaItem}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ui.lessonSummary}</Text>
          <View style={styles.quote}>
            <Text>{draft.lessonSummary}</Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.label}>{ui.learningProfile}</Text>
          <Text style={styles.profileTitle}>
            {template.profileTitle[locale]}
          </Text>
          <Text>{template.profileDescription[locale]}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ui.competencies}</Text>
          {COMPETENCY_KEYS.map((key) => (
            <View key={key} style={styles.competencyRow}>
              <Text style={styles.competencyName}>
                {REPORT_LABELS.competencies[key][locale]}
              </Text>
              <Text style={styles.competencyScore}>
                {draft.competencies[key]}
              </Text>
              <View style={styles.scale}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <View
                    key={value}
                    style={[
                      styles.scaleCell,
                      value <= draft.competencies[key]
                        ? styles.scaleActive
                        : {},
                    ]}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
        <Footer locale={locale} pageNumber={1} />
      </Page>

      <Page size="A4" style={styles.page}>
        <Header logoUrl={logoUrl} />
        <View>
          <Text style={styles.sectionTitle}>{ui.observations}</Text>
          <View style={styles.checklist}>
            {selectedObservations.map((key) => (
              <View key={key} style={styles.checkRow}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.checkText}>
                  {REPORT_LABELS.observations[key][locale]}
                </Text>
              </View>
            ))}
          </View>
          {draft.observationNote ? (
            <View style={[styles.quote, { marginTop: 10 }]}>
              <Text>{draft.observationNote}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ui.swot}</Text>
          <View style={styles.swotGrid}>
            {[
              [ui.strengths, draft.swot.strengths],
              [ui.development, draft.swot.development],
              [ui.opportunities, draft.swot.opportunities],
              [ui.risks, draft.swot.risks],
            ].map(([title, items]) => (
              <View key={title as string} style={styles.swotCard}>
                <Text style={styles.swotTitle}>{title as string}</Text>
                <BulletList items={items as string[]} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ui.learningStyle}</Text>
          <Text style={[styles.paragraph, { fontWeight: 700 }]}>
            {ui.learnsBest}
          </Text>
          <View style={styles.checklist}>
            {selectedStyles.map((key) => (
              <View key={key} style={styles.checkRow}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.checkText}>
                  {REPORT_LABELS.learningStyles[key][locale]}
                </Text>
              </View>
            ))}
          </View>
          <Text
            style={[
              styles.paragraph,
              { marginTop: 10, fontWeight: 700 },
            ]}
          >
            {ui.support}
          </Text>
          <View style={styles.checklist}>
            {selectedSupport.length > 0 ? (
              selectedSupport.map((key) => (
                <View key={key} style={styles.checkRow}>
                  <Text style={styles.check}>✓</Text>
                  <Text style={styles.checkText}>
                    {REPORT_LABELS.supportNeeds[key][locale]}
                  </Text>
                </View>
              ))
            ) : (
              <Text>—</Text>
            )}
          </View>
        </View>
        <Footer locale={locale} pageNumber={2} />
      </Page>

      <Page size="A4" style={styles.page}>
        <Header logoUrl={logoUrl} />
        <Text style={styles.title}>{ui.recommendations}</Text>
        {[
          [ui.taskFormat, template.taskFormat[locale]],
          [ui.feedback, template.feedback[locale]],
          [ui.attention, template.attention[locale]],
        ].map(([title, text]) => (
          <View key={title} style={styles.recommendation}>
            <Text style={styles.recommendationTitle}>{title}</Text>
            <Text>{text}</Text>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ui.conclusion}</Text>
          <View style={styles.quote}>
            <Text>{draft.conclusion}</Text>
          </View>
        </View>

        <View style={[styles.profileCard, { marginTop: 24 }]}>
          <Text style={styles.profileTitle}>
            {template.profileTitle[locale]}
          </Text>
          <Text>{template.profileDescription[locale]}</Text>
        </View>
        <Footer locale={locale} pageNumber={3} />
      </Page>
    </Document>
  );
}
