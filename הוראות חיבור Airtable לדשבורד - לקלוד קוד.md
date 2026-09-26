# הוראות חיבור Airtable לדשבורד — לקלוד קוד

## מטרה
לחבר את נתוני הדמה של סוכנות הנסיעות ל-Airtable, ולגרום לדשבורד הגרפי הקיים (שעונים בסטייל רכב ספורט, אדום-שחור) לקרוא את הנתונים משם במקום מקבצי CSV/JSON סטטיים.

## פרטי חיבור
- **Airtable API Key (Personal Access Token)**: `<הדבק כאן את המפתח>`
- **Base ID**: `<הדבק כאן, מתחיל ב-app...>`

**חשוב — אבטחה:** אל תכתוב את המפתח בקוד עצמו. שמור אותו בקובץ `.env` (משתנה בשם `AIRTABLE_API_KEY`) והוסף `.env` ל-`.gitignore`. כל קריאה ל-API צריכה לעבור מהבקאנד (server), לא מה-frontend, כדי שהמפתח לא ייחשף בדפדפן.

---

## שלב 1: יצירת הטבלאות ב-Airtable דרך ה-API

צור שתי טבלאות בבסיס הנתונים (Base) הקיים, בעזרת ה-Airtable Meta API (`POST https://api.airtable.com/v0/meta/bases/{baseId}/tables`):

### טבלה 1: `bookings`
| שם עמודה   | סוג שדה (Airtable field type) |
|------------|-------------------------------|
| id         | Single line text             |
| date       | Date                          |
| city       | Single line text             |
| country    | Single line text             |
| pax        | Number (integer)             |
| type       | Single select (חבילה / טיסה בלבד / מלון בלבד / קרוז / טיול מודרך) |
| agent_id   | Number (integer)             |
| channel    | Single select (אתר / טלפון / וואטסאפ / סוכן משנה / מטא Ads) |
| status     | Single select (שולם / ממתין לתשלום / בוטל) |
| revenue    | Number (decimal)             |
| profit     | Number (decimal)             |
| nights     | Number (integer)             |

### טבלה 2: `agent_performance`
| שם עמודה           | סוג שדה |
|--------------------|---------|
| agent_id           | Number (integer) |
| total_bookings     | Number (integer) |
| paid_bookings      | Number (integer) |
| cancelled_bookings | Number (integer) |
| total_pax          | Number (integer) |
| unique_destinations| Number (integer) |
| total_revenue      | Number (decimal) |
| total_profit       | Number (decimal) |

---

## שלב 2: מילוי הטבלאות מהקבצים המצורפים

הקבצים המצורפים (`bookings.json`, `agent_performance.json`) מכילים את הדאטה המלא. כתוב סקריפט חד-פעמי (Node.js או Python) שקורא את קבצי ה-JSON ומכניס את הרשומות לטבלאות ב-Airtable באמצעות `POST /v0/{baseId}/{tableName}` — בקבוצות של עד 10 רשומות בכל קריאה (מגבלת ה-API של Airtable).

הרץ את הסקריפט הזה **פעם אחת בלבד** להזרעת (seed) הנתונים. אל תשאיר אותו רץ באפליקציה.

---

## שלב 3: חיבור הדשבורד ל-Airtable במקום לקבצים הסטטיים

1. הוסף route בבקאנד (למשל `/api/bookings` ו-`/api/agent-performance`) שמבצע `GET` מ-Airtable (`GET https://api.airtable.com/v0/{baseId}/bookings` וכו') עם ה-header `Authorization: Bearer <AIRTABLE_API_KEY>`, ומחזיר את הנתונים ל-frontend כ-JSON.
2. שים לב ל-pagination של Airtable — כל תגובה מחזירה עד 100 רשומות ושדה `offset`; המשך לבקש עד שאין `offset` נוסף, כדי לקבל את כל 720 ההזמנות.
3. עדכן את ה-frontend הקיים (קומפוננטות ה-Gauge, בורר היעדים, טבלת ההזמנות, טבלת ביצועי הסוכנים) לשלוף נתונים מ-`/api/bookings` ו-`/api/agent-performance` במקום מקובץ סטטי מקומי — דרך React Query כמו שכבר בנוי באפליקציה.
4. הוסף cache קצר (30-60 שניות) בבקאנד כדי לא להכביד על מגבלת הקריאות של Airtable (5 בקשות לשנייה ל-Base).

---

## שלב 4: בדיקה
- ודא שכל השעונים (KPI, יעדים, ערוצים, ביצועי סוכנים) מציגים את אותם מספרים כמו לפני החיבור ל-Airtable
- ודא שהטבלאות התחתונות (הזמנות מלאות + ביצועי סוכנים) מציגות את כל השורות מ-Airtable, כולל מיון וסינון
- בדוק שהוספת/שינוי שורה ב-Airtable משתקפת בדשבורד לאחר רענון (או polling אם מומש)

## קבצים מצורפים
- `bookings.json`
- `agent_performance.json`
