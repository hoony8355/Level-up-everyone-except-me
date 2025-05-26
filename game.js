// ✅ 확장된 시뮬레이션 요소 구현: 스탯, 해고, 의뢰 성공률, 오후 훈련, 업그레이드

let turn = 1;
let gold = 500;
let reputation = 50;
let capacity = 3;
let adventurers = [];
let applicants = [];
let questBoard = [];
let activeQuests = [];
let upgrades = { training: false, promotion: false };

const jobPool = ["전사", "마법사", "도적", "농부", "성기사"];
const races = ["엘프", "오크", "인간", "드워프"];

function getRandomStat() {
  return {
    level: 1,
    hp: 100,
    atk: Math.floor(Math.random() * 10 + 10),
    spd: Math.floor(Math.random() * 10 + 5),
    skill: Math.random() > 0.7 ? "필살기" : null
  };
}

function newAdventurer() {
  return {
    name: `모험가${Math.floor(Math.random() * 1000)}`,
    race: races[Math.floor(Math.random() * races.length)],
    job: jobPool[Math.floor(Math.random() * jobPool.length)],
    ...getRandomStat(),
  };
}

function startMorning() {
  applicants = [];
  const count = Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) applicants.push(newAdventurer());
  console.log(`\n[🕘 오전] 새로운 지원자 수: ${applicants.length}`);
  applicants.forEach((a, i) => {
    console.log(`지원자${i + 1}: ${a.name} (${a.race} ${a.job}, 레벨 ${a.level}, HP ${a.hp})`);
  });
}

function hire(index) {
  if (adventurers.length >= capacity) return console.log("❌ 정원이 초과되어 고용할 수 없습니다.");
  adventurers.push(applicants.splice(index, 1)[0]);
  console.log("✅ 고용 완료.");
}

function fire(index) {
  const adv = adventurers[index];
  const cost = 50 + adv.level * 10;
  gold -= cost;
  reputation -= 5;
  console.log(`❌ ${adv.name} 해고됨 (퇴직금 ${cost}G 지불, 평판 -5)`);
  adventurers.splice(index, 1);
}

function startLunch() {
  questBoard = [];
  const count = Math.floor(Math.random() * 3 + 1);
  for (let i = 0; i < count; i++) {
    const difficulty = Math.floor(Math.random() * 3 + 1);
    const reward = 100 + difficulty * 50;
    const exp = 10 * difficulty;
    const requiredLevel = difficulty;
    questBoard.push({
      title: `의뢰${turn}-${i + 1}`,
      difficulty,
      reward,
      exp,
      requiredLevel,
      assigned: []
    });
  }
  console.log(`\n[🍽 점심] 의뢰 등장: ${questBoard.length}개`);
  questBoard.forEach((q, i) => {
    console.log(`${i + 1}. ${q.title} (난이도 ${q.difficulty}, 보상 ${q.reward}G)`);
  });
}

function assignAdventurerToQuest(questIndex, adventurerIndex) {
  const quest = questBoard[questIndex];
  const adv = adventurers[adventurerIndex];
  if (!quest || !adv) return;
  quest.assigned.push(adv);
  console.log(`🧙‍♂️ ${adv.name} → ${quest.title} 배정 완료.`);
}

function startEvening() {
  console.log("\n[☀️ 오후] 훈련 또는 업그레이드 시간");
  // 단순 홍보: 평판 +10 / 업그레이드 시 정원 +1 (1회)
  if (!upgrades.promotion) {
    reputation += 10;
    upgrades.promotion = true;
    console.log("📢 홍보 실행 → 평판 +10");
  }
  if (!upgrades.training) {
    capacity += 1;
    upgrades.training = true;
    console.log("🏠 숙소 확장 → 정원 +1");
  }
}

function startNight() {
  console.log("\n[🌙 밤] 의뢰 수행 결과");
  for (const quest of questBoard) {
    if (quest.assigned.length === 0) continue;
    let teamLevel = quest.assigned.reduce((sum, a) => sum + a.level, 0);
    let avgLevel = teamLevel / quest.assigned.length;
    let successRate = 60 + (avgLevel - quest.requiredLevel) * 15;
    const success = Math.random() * 100 < successRate;

    if (success) {
      gold += quest.reward;
      quest.assigned.forEach(a => a.level++);
      reputation += 3;
      console.log(`🎯 ${quest.title}: 성공! 보상 ${quest.reward}G, 팀원 레벨 +1`);
    } else {
      quest.assigned.forEach(a => (a.hp -= 30));
      reputation -= 5;
      console.log(`💀 ${quest.title}: 실패. 팀원 HP -30, 평판 -5`);
    }
  }
}

function nextTurn() {
  console.log(`\n=======================\n📆 [DAY ${turn}]\n=======================`);
  startMorning();
  startLunch();
  startEvening();
  startNight();
  turn++;
}

// 테스트 실행
testGame();
function testGame() {
  for (let i = 0; i < 3; i++) nextTurn();
  console.log("\n💼 최종 길드 상태:", { gold, reputation, capacity, 모험가수: adventurers.length });
}
