export const PRESENCE_TZ = 'Asia/Hebron';

export const presenceThemes = {
  sleeping: { color: '#9ca8b8', glow: 'rgba(120,145,180,.24)', soft: 'rgba(64,80,112,.18)', wash: 'rgba(80,110,155,.10)', line: 'rgba(160,180,210,.22)', intensity: 'low', motion: 'calm' },
  studying: { color: '#f0d7a1', glow: 'rgba(240,215,161,.24)', soft: 'rgba(150,116,62,.14)', wash: 'rgba(225,180,95,.08)', line: 'rgba(240,215,161,.28)', intensity: 'mid', motion: 'normal' },
  coding: { color: '#a9d9ff', glow: 'rgba(120,190,255,.26)', soft: 'rgba(50,110,170,.14)', wash: 'rgba(80,160,240,.09)', line: 'rgba(165,215,255,.28)', intensity: 'mid', motion: 'normal' },
  gaming: { color: '#d7bdff', glow: 'rgba(175,130,255,.25)', soft: 'rgba(100,65,160,.16)', wash: 'rgba(150,95,245,.10)', line: 'rgba(205,175,255,.28)', intensity: 'mid', motion: 'normal' },
  friends: { color: '#ffc8b2', glow: 'rgba(255,170,140,.23)', soft: 'rgba(145,75,55,.15)', wash: 'rgba(235,120,100,.08)', line: 'rgba(255,195,175,.26)', intensity: 'mid', motion: 'normal' },
  rest: { color: '#b8d9d5', glow: 'rgba(120,205,190,.20)', soft: 'rgba(55,125,115,.12)', wash: 'rgba(85,185,165,.07)', line: 'rgba(170,225,215,.22)', intensity: 'low', motion: 'calm' },
  available: { color: '#d5dde8', glow: 'rgba(185,205,225,.20)', soft: 'rgba(95,120,150,.13)', wash: 'rgba(160,185,215,.07)', line: 'rgba(205,220,235,.22)', intensity: 'low', motion: 'calm' },
  football: { color: '#c9e7bd', glow: 'rgba(145,205,125,.21)', soft: 'rgba(75,125,60,.13)', wash: 'rgba(125,190,95,.08)', line: 'rgba(190,225,170,.24)', intensity: 'mid', motion: 'normal' }
};

export const presenceLabels = {
  sleeping: 'statusSleeping', studying: 'statusStudying', coding: 'statusCoding',
  gaming: 'statusGaming', friends: 'statusFriends', rest: 'statusRest',
  available: 'statusAvailable', football: 'statusFootball'
};

// Relative selection weights for a typical awake day. Study is intentionally the largest share.
export const PRESENCE_WEIGHTS = Object.freeze({
  studying: 48,
  coding: 12,
  gaming: 13,
  friends: 9,
  rest: 12,
  available: 6
});

const WEEKDAY_INDEX = Object.freeze({ Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 });
const DAY_MINUTES = 24 * 60;

const ACTIVITY_RULES = Object.freeze({
  studying: { min: 72, max: 138 },
  coding: { min: 38, max: 82 },
  gaming: { min: 45, max: 98 },
  friends: { min: 52, max: 118 },
  rest: { min: 28, max: 66 },
  available: { min: 25, max: 54 },
  football: { min: 55, max: 100 }
});

function getHebronParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PRESENCE_TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    weekday: WEEKDAY_INDEX[values.weekday] ?? date.getDay(),
    minutes: Number(values.hour) * 60 + Number(values.minute),
    seconds: Number(values.second || 0)
  };
}

function getHebronDayKey(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PRESENCE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function seededRandom(seedText) {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function allocateQuotas(awakeMinutes) {
  const exact = Object.entries(PRESENCE_WEIGHTS).map(([mode, weight]) => ({
    mode,
    raw: awakeMinutes * weight / 100
  }));
  const quotas = Object.fromEntries(exact.map(({ mode, raw }) => [mode, Math.floor(raw)]));
  let remaining = awakeMinutes - Object.values(quotas).reduce((sum, minutes) => sum + minutes, 0);
  exact.sort((left, right) => (right.raw - Math.floor(right.raw)) - (left.raw - Math.floor(left.raw)));
  for (let index = 0; index < remaining; index += 1) quotas[exact[index % exact.length].mode] += 1;
  return quotas;
}

function splitQuotaIntoBlocks(random, mode, quota) {
  const rule = ACTIVITY_RULES[mode];
  if (!rule || quota <= 0) return [];
  if (quota < rule.min) return [{ mode, duration: quota }];

  const minimumCount = Math.max(1, Math.ceil(quota / rule.max));
  const maximumCount = Math.max(1, Math.floor(quota / rule.min));
  const preferredDuration = rule.min + random() * (rule.max - rule.min);
  const count = Math.min(maximumCount, Math.max(minimumCount, Math.round(quota / preferredDuration)));
  const capacity = rule.max - rule.min;
  let remainingExtra = quota - count * rule.min;
  const blocks = [];

  for (let index = 0; index < count; index += 1) {
    const remainingSlots = count - index - 1;
    const minimumExtra = Math.max(0, remainingExtra - remainingSlots * capacity);
    const maximumExtra = Math.min(capacity, remainingExtra);
    const extra = index === count - 1
      ? remainingExtra
      : Math.floor(minimumExtra + random() * (maximumExtra - minimumExtra + 1));
    blocks.push({ mode, duration: rule.min + extra });
    remainingExtra -= extra;
  }
  return blocks;
}

function timePreference(mode, minute) {
  const hour = minute / 60;
  const profiles = {
    studying: hour < 10 ? 1.62 : hour < 15 ? 1.34 : hour < 18 ? 1.02 : hour < 21 ? .72 : hour < 23 ? .30 : .06,
    coding: hour < 9 ? .42 : hour < 15 ? 1.04 : hour < 20 ? 1.34 : hour < 22 ? .92 : .18,
    gaming: hour < 15 ? .006 : hour < 17 ? .72 : hour < 22 ? 5.6 : hour < 23 ? 1.15 : .04,
    friends: hour < 11 ? .08 : hour < 15 ? .54 : hour < 21 ? 1.86 : hour < 23 ? .48 : .03,
    rest: hour < 10 ? .68 : hour < 15 ? 1.02 : hour < 18 ? 1.18 : hour < 22 ? 1.02 : 1.82,
    available: hour < 10 ? .48 : hour < 15 ? .68 : hour < 21 ? 1.04 : hour < 23 ? 1.32 : .56,
    football: hour < 15 ? .015 : hour < 17 ? .72 : hour < 22 ? 1.88 : .04
  };
  return profiles[mode] || 1;
}

function chooseNextBlock(random, candidates, minute) {
  const weighted = candidates.map((block) => ({
    block,
    weight: Math.max(.0001, block.duration * timePreference(block.mode, minute) * (.78 + random() * .44))
  }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let cursor = random() * total;
  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) return item.block;
  }
  return weighted.at(-1).block;
}

function mergeAdjacentBlocks(schedule) {
  const merged = [];
  for (const block of schedule) {
    const previous = merged.at(-1);
    const combined = previous ? block.end - previous.start : 0;
    const maximum = ACTIVITY_RULES[block.mode]?.max ?? DAY_MINUTES;
    if (previous && previous.mode === block.mode && previous.end === block.start && combined <= maximum) {
      previous.end = block.end;
    } else {
      merged.push({ ...block });
    }
  }
  return merged;
}

/** Create a repeatable but day-changing schedule using Palestine local time. */
export function createDailySchedule(date = new Date()) {
  const dayKey = getHebronDayKey(date);
  const { weekday } = getHebronParts(date);
  const random = seededRandom(dayKey);
  const wakeHour = random() < .27 ? 6 : 8;
  const wakeMinute = wakeHour * 60;
  const awakeMinutes = DAY_MINUTES - wakeMinute;
  const quotas = allocateQuotas(awakeMinutes);

  const footballDay = weekday === 5 || weekday === 6 ? random() < .34 : random() < .08;
  if (footballDay) {
    const footballMinutes = Math.min(78, Math.max(0, Math.round(quotas.friends * .72)));
    quotas.friends -= footballMinutes;
    quotas.football = footballMinutes;
  }

  const pending = Object.entries(quotas).flatMap(([mode, quota]) => splitQuotaIntoBlocks(random, mode, quota));
  const schedule = [{ start: 0, end: wakeMinute, mode: 'sleeping' }];
  let cursor = wakeMinute;
  let previousMode = 'sleeping';
  let guard = 0;

  while (pending.length && guard < 100) {
    guard += 1;
    let candidates = pending.filter((block) => block.mode !== previousMode);
    if (!candidates.length) candidates = pending;

    if (cursor < 17 * 60) {
      const daytime = candidates.filter((block) => !['gaming', 'football'].includes(block.mode));
      if (daytime.length) candidates = daytime;
    }

    const selected = chooseNextBlock(random, candidates, cursor);
    pending.splice(pending.indexOf(selected), 1);
    const end = cursor + selected.duration;
    schedule.push({ start: cursor, end, mode: selected.mode });
    cursor = end;
    previousMode = selected.mode;
  }

  if (pending.length || cursor !== DAY_MINUTES) {
    throw new Error(`Presence schedule did not cover exactly one day (${dayKey}, ${cursor}/1440).`);
  }

  return mergeAdjacentBlocks(schedule).map((block, index) => ({
    ...block,
    id: `${dayKey}-${index}-${block.mode}`
  }));
}

export function resolveSmartPresence(now = new Date()) {
  const { weekday, minutes, seconds } = getHebronParts(now);
  const dayKey = getHebronDayKey(now);
  const schedule = createDailySchedule(now);
  const block = schedule.find((item) => minutes >= item.start && minutes < item.end) || schedule.at(-1);
  const mode = block?.mode || 'sleeping';
  return {
    mode,
    blockId: block?.id || `${dayKey}-default`,
    dayKey,
    weekday,
    minutes,
    seconds,
    start: block?.start ?? 0,
    end: block?.end ?? DAY_MINUTES,
    labelKey: presenceLabels[mode] || 'statusAvailable',
    theme: presenceThemes[mode] || presenceThemes.available,
    schedule
  };
}
