import {
  MockupFrame,
  FlagList,
  CompareTwo,
  Timeline,
  KeyCap,
} from "@/components/example-primitives";

// --- Фішинг --------------------------------------------------------------

function PhishingIntroExample() {
  return (
    <CompareTwo
      left={{
        label: "Фішинговий лист",
        text: '«Термінове оновлення бази НСЗУ/МІС: підтвердьте доступ за посиланням, інакше акаунт буде заблоковано через 2 години». Від: support@nszu-secure-update.info',
      }}
      right={{
        label: "Офіційне повідомлення",
        text: "Персональне звернення на ваше ім'я від відомого внутрішнього відправника, без тиску й посилань на введення пароля.",
      }}
    />
  );
}

function PhishingRecognizeExample() {
  const flags = [
    {
      n: 1,
      label: "Підозріла адреса відправника",
      detail:
        "Домен схожий на офіційний, але не збігається з ним — зверніть увагу на зайві слова та закінчення.",
    },
    {
      n: 2,
      label: "Штучна терміновість",
      detail: "«Термінове», «протягом 2 годин», «буде заблоковано» — тиск на паніку.",
    },
    {
      n: 3,
      label: "Знеособлене звернення",
      detail:
        "«Шановний користувачу» замість вашого імені — офіційні листи зазвичай персоналізовані.",
    },
    {
      n: 4,
      label: "Посилання веде не туди",
      detail:
        "Текст кнопки каже «Підтвердити доступ», а реальна адреса знизу — зовсім інший, сторонній сайт.",
    },
  ];

  return (
    <div>
      <MockupFrame title="Приклад листа (умовний, для навчання)">
        <div className="flex items-start gap-2 pb-2 border-b border-slate-100">
          <span className="text-slate-400 shrink-0 w-14">Від:</span>
          <span className="font-medium text-slate-700 underline decoration-red-400 decoration-2 underline-offset-2">
            &laquo;НСЗУ Підтримка&raquo; &lt;support@nszu-secure-update.info&gt;
          </span>
          <NumBadge n={1} />
        </div>
        <div className="flex items-start gap-2 py-2 border-b border-slate-100">
          <span className="text-slate-400 shrink-0 w-14">Тема:</span>
          <span className="font-semibold text-slate-800 underline decoration-red-400 decoration-2 underline-offset-2">
            Термінове оновлення бази: підтвердьте доступ протягом 2 годин
          </span>
          <NumBadge n={2} />
        </div>
        <div className="pt-3 space-y-2">
          <p className="text-slate-600 flex items-start gap-2">
            <span className="underline decoration-red-400 decoration-2 underline-offset-2">
              Шановний користувачу,
            </span>
            <NumBadge n={3} />
          </p>
          <div className="h-2 w-full rounded bg-slate-100" />
          <div className="h-2 w-5/6 rounded bg-slate-100" />
          <div className="pt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-white text-sm font-semibold underline decoration-white decoration-2 underline-offset-4">
              Підтвердити доступ →
            </span>
            <NumBadge n={4} />
          </div>
          <p className="text-xs text-slate-400 font-mono break-all">
            посилання: https://nszu-verify-login.ru/confirm?id=48213
          </p>
        </div>
      </MockupFrame>
      <FlagList flags={flags} />
    </div>
  );
}

function NumBadge({ n }: { n: number }) {
  return (
    <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold">
      {n}
    </span>
  );
}

function PhishingLinkCheckExample() {
  return (
    <MockupFrame title="Перевірка посилання перед кліком">
      <p className="text-xs text-slate-500 mb-2">
        Наведіть курсор на посилання (не натискаючи) — реальна адреса
        з&apos;явиться знизу вікна браузера:
      </p>
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 mb-2">
        <span className="text-blue-600 underline">Підтвердити доступ до кабінету →</span>
      </div>
      <CompareTwo
        left={{
          label: "Справжня адреса знизу",
          text: "https://nszu-verify-login.ru/confirm — сторонній домен, нічого спільного з офіційним сайтом.",
        }}
        right={{
          label: "Мало б бути",
          text: "https://cabinet.nszu.gov.ua/... — офіційний домен закладу чи сервісу.",
        }}
      />
    </MockupFrame>
  );
}

function PhishingReportExample() {
  return (
    <MockupFrame title="Дії при підозрілому листі">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 p-3 mb-3">
        <span className="text-slate-600">
          ✉️ Термінове оновлення бази НСЗУ/МІС...
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-white text-xs font-semibold">
          Переслати в IT-відділ
        </span>
      </div>
      <p className="text-sm text-slate-600">
        Не відповідайте і не переходьте за посиланням — перешліть лист чи
        повідомте про нього системного адміністратора або IT-відділ.
      </p>
    </MockupFrame>
  );
}

function PhishingIncidentExample() {
  return (
    <MockupFrame title="Якщо ви вже натиснули посилання">
      <Timeline
        steps={[
          "Негайно повідомте IT-відділ чи системного адміністратора.",
          "Змініть пароль облікового запису, куди могли ввести дані.",
          "Перевірте разом з IT, чи не було підозрілої активності в акаунті.",
        ]}
      />
    </MockupFrame>
  );
}

// --- Паролі ---------------------------------------------------------------

function PasswordAuditExample() {
  return (
    <MockupFrame title="Журнал дій у МІС">
      <div className="space-y-1.5 font-mono text-xs text-slate-600">
        <div className="rounded bg-slate-50 px-2 py-1.5">
          14:32 — Змінено картку пацієнта №4821 —{" "}
          <span className="font-semibold text-slate-800">Іваненко О.П.</span>
        </div>
        <div className="rounded bg-slate-50 px-2 py-1.5">
          14:35 — Видалено запис призначення —{" "}
          <span className="font-semibold text-slate-800">Іваненко О.П.</span>
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-3">
        Кожна дія прив&apos;язана до конкретного акаунту — навіть якщо за
        клавіатурою фактично сидів хтось інший.
      </p>
    </MockupFrame>
  );
}

function PasswordStickyNoteExample() {
  return (
    <MockupFrame title="Робоче місце — типова помилка">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-28 items-center justify-center rounded-md border-2 border-slate-300 bg-slate-800 text-[10px] text-slate-400 shrink-0">
          Монітор
        </div>
        <div className="relative">
          <div className="h-16 w-16 rotate-[-4deg] rounded-sm bg-amber-200 shadow-sm p-2 text-[10px] font-mono text-amber-900 leading-tight">
            Пароль:
            <br />
            12345
          </div>
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
            ✕
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-3">
        Стікер із паролем біля монітора бачить кожен, хто заходить у кабінет.
      </p>
    </MockupFrame>
  );
}

function PasswordReuseExample() {
  return (
    <MockupFrame title="Один пароль — кілька систем">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
          🔑 12345
        </span>
        <span className="text-slate-300">→</span>
        <div className="flex gap-2 flex-wrap">
          <span className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            МІС
          </span>
          <span className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            Робоча пошта
          </span>
          <span className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            Особистий акаунт
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-3">
        Якщо зламають один сервіс з таким паролем — під загрозою всі інші.
      </p>
    </MockupFrame>
  );
}

function PasswordResetFlowExample() {
  return (
    <MockupFrame title="Колега забула пароль — що робити">
      <Timeline
        steps={[
          "Колега звертається по допомогу з доступом.",
          "Направте її до системного адміністратора, а не диктуйте свій пароль.",
          "Адміністратор скидає саме її пароль — доступ відновлено за кілька хвилин.",
        ]}
      />
    </MockupFrame>
  );
}

function PasswordStrengthExample() {
  return (
    <MockupFrame title="Слабкий і надійний пароль">
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-slate-600">12345</span>
            <span className="text-red-600 font-medium">Слабкий</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-1/5 bg-red-500 rounded-full" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-slate-600">Хм7$вKp!42qL</span>
            <span className="text-green-600 font-medium">Надійний</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-full bg-green-500 rounded-full" />
          </div>
        </div>
      </div>
    </MockupFrame>
  );
}

// --- Носії пацієнтів --------------------------------------------------------

function MediaUnknownUsbExample() {
  return (
    <MockupFrame title="Флешка від пацієнта">
      <div className="flex items-center justify-center gap-4">
        <span className="text-3xl">🙋</span>
        <span className="text-slate-300">→</span>
        <div className="relative">
          <span className="text-3xl">💾</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-white text-[10px] font-bold">
            ?
          </span>
        </div>
        <span className="text-slate-300">→</span>
        <span className="text-3xl">🖥️</span>
      </div>
      <p className="text-sm text-slate-600 mt-3 text-center">
        Походження і вміст флешки пацієнта невідомі — вона могла підключатись
        до заражених комп&apos;ютерів.
      </p>
    </MockupFrame>
  );
}

function MediaNetworkSpreadExample() {
  return (
    <MockupFrame title="Як вірус поширюється мережею">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 border-2 border-red-400 text-xl">
          🖥️
        </span>
        <span className="text-red-400" aria-hidden>
          ⤳
        </span>
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 border-2 border-red-300 text-xl">
          🖥️
        </span>
        <span className="text-red-400" aria-hidden>
          ⤳
        </span>
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 border-2 border-red-300 text-xl">
          🗄️
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-3 text-center">
        Один заражений кабінет → інші кабінети → сервер лікарні.
      </p>
    </MockupFrame>
  );
}

function MediaScanExample() {
  return (
    <MockupFrame title="Перевірка антивірусом перед відкриттям">
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Сканування: USB_МРТ_пацієнт.zip</span>
          <span>74%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-3/4 bg-blue-600 rounded-full" />
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-3">
        Завжди перевіряйте зовнішній носій антивірусом, перш ніж відкривати
        файли.
      </p>
    </MockupFrame>
  );
}

function MediaIsolatedStationExample() {
  return (
    <MockupFrame title="Ізольована станція vs робочий комп'ютер">
      <CompareTwo
        left={{
          label: "Небезпечно",
          text: "USB → робочий комп'ютер, підключений до мережі лікарні → ризик зараження сервера.",
        }}
        right={{
          label: "Безпечно",
          text: "USB → ізольована станція або PACS-сервер, не підключена до основної мережі.",
        }}
      />
    </MockupFrame>
  );
}

function MediaForbiddenExample() {
  return (
    <MockupFrame title="Файли на флешці пацієнта">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm">
          <span className="text-green-800">🖼️ знімок_МРТ.dcm</span>
          <span className="text-green-600 text-xs font-medium">Можна відкрити</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm">
          <span className="text-red-800">⚙️ переглядач_знімків.exe</span>
          <span className="text-red-600 text-xs font-medium">Не запускати</span>
        </div>
      </div>
    </MockupFrame>
  );
}

// --- Блокування екрана ------------------------------------------------------

function LockUnattendedExample() {
  return (
    <MockupFrame title="Кабінет без нагляду">
      <div className="flex items-center justify-center gap-4">
        <div className="h-16 w-24 rounded-md border-2 border-slate-300 bg-white p-1.5">
          <div className="h-2 w-3/4 rounded bg-blue-100 mb-1" />
          <div className="h-2 w-full rounded bg-slate-100 mb-1" />
          <div className="h-2 w-2/3 rounded bg-slate-100" />
        </div>
        <span className="text-2xl">🚪</span>
        <span className="text-2xl">🚶</span>
      </div>
      <p className="text-sm text-slate-600 mt-3 text-center">
        Картка пацієнта відкрита, а кабінет порожній — доступ має будь-хто, хто
        зайде.
      </p>
    </MockupFrame>
  );
}

function LockMonitorOffExample() {
  return (
    <MockupFrame title="Вимкнений монітор ≠ заблокований комп'ютер">
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="h-16 w-24 rounded-md bg-slate-900 mb-1.5" />
          <span className="text-xs text-slate-500">Екран вимкнено</span>
        </div>
        <span className="text-slate-300">≠</span>
        <div className="text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2 py-1 text-xs font-medium">
            ● Сесія все ще активна
          </span>
        </div>
      </div>
    </MockupFrame>
  );
}

function LockWinLExample() {
  return (
    <MockupFrame title="Комбінація клавіш для блокування">
      <div className="flex items-center justify-center gap-3">
        <KeyCap>Win</KeyCap>
        <span className="text-slate-400 font-bold">+</span>
        <KeyCap>L</KeyCap>
      </div>
      <p className="text-sm text-slate-600 mt-3 text-center">
        Натискайте цю комбінацію щоразу, як відходите від комп&apos;ютера.
      </p>
    </MockupFrame>
  );
}

function LockAutoTimeoutExample() {
  return (
    <MockupFrame title="Автоматичне блокування (додаткова страховка)">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5">
        <span className="text-sm text-slate-600">
          Блокувати після бездіяльності
        </span>
        <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
          5 хв
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-3">
        Корисна страховка, але не замінює звичку блокувати екран самостійно.
      </p>
    </MockupFrame>
  );
}

function LockExposedDataExample() {
  return (
    <MockupFrame title="Що бачить сторонній без блокування">
      <div className="relative rounded-lg border border-slate-200 p-3">
        <div className="h-2 w-2/3 rounded bg-slate-100 mb-1.5" />
        <div className="h-2 w-full rounded bg-slate-100 mb-1.5" />
        <div className="h-2 w-1/2 rounded bg-slate-100" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-8deg] rounded border-2 border-red-500 px-3 py-1 text-xs font-bold text-red-600 bg-white/70">
            КОНФІДЕНЦІЙНО
          </span>
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-3">
        Персональні дані пацієнта відкриті для будь-кого, хто підійде до
        екрана.
      </p>
    </MockupFrame>
  );
}

export const courseExamples: Record<string, () => React.ReactElement> = {
  "phishing-intro": PhishingIntroExample,
  "phishing-recognize": PhishingRecognizeExample,
  "phishing-link-check": PhishingLinkCheckExample,
  "phishing-report": PhishingReportExample,
  "phishing-incident": PhishingIncidentExample,
  "password-audit": PasswordAuditExample,
  "password-sticky-note": PasswordStickyNoteExample,
  "password-reuse": PasswordReuseExample,
  "password-reset-flow": PasswordResetFlowExample,
  "password-strength": PasswordStrengthExample,
  "media-unknown-usb": MediaUnknownUsbExample,
  "media-network-spread": MediaNetworkSpreadExample,
  "media-scan": MediaScanExample,
  "media-isolated-station": MediaIsolatedStationExample,
  "media-forbidden": MediaForbiddenExample,
  "lock-unattended": LockUnattendedExample,
  "lock-monitor-off": LockMonitorOffExample,
  "lock-win-l": LockWinLExample,
  "lock-auto-timeout": LockAutoTimeoutExample,
  "lock-exposed-data": LockExposedDataExample,
};
