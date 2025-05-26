// game.js (리팩토링된 인터페이스 기반)
export default class GuildGame {
  constructor(logCallback) {
    this.day = 1;
    this.gold = 500;
    this.reputation = 0;
    this.capacity = 3;
    this.adventurers = [];
    this.applicants = [];
    this.quests = [];
    this.log = logCallback;
  }

  nextDay() {
    this.day++;
    this.log(`=======================\n📆 [DAY ${this.day}]\n=======================`);
  }

  handleMorning() {
    const newApplicants = Math.floor(Math.random() * 2);
    this.log(`\n[🕘 MORNING] New applicants: ${newApplicants}`);
    this.applicants = [];

    for (let i = 0; i < newApplicants; i++) {
      const name = `Adventurer${Math.floor(Math.random() * 1000)}`;
      const race = this.getRandom(["Human", "Elf", "Orc", "Dwarf"]);
      const job = this.getRandom(["Knight", "Mage", "Priest", "Farmer"]);
      const hp = 100;
      const adventurer = { name, race, job, level: 1, hp };
      this.applicants.push(adventurer);
      this.log(`Applicant${i + 1}: ${name} (${race} ${job}, Lv1, HP ${hp})`);
    }
  }

  handleLunch() {
    const questCount = 1 + Math.floor(Math.random() * 3);
    this.log(`\n[🍽 LUNCH] Quests Available: ${questCount}`);
    this.quests = [];

    for (let i = 0; i < questCount; i++) {
      const difficulty = 1 + Math.floor(Math.random() * 3);
      const reward = 150 + difficulty * 50;
      const quest = { id: `Q${this.day}-${i + 1}`, difficulty, reward };
      this.quests.push(quest);
      this.log(`${i + 1}. ${quest.id} (Lv${difficulty}, 💰 ${reward}G)`);
    }
  }

  handleAfternoon() {
    this.log(`\n[☀️ AFTERNOON] Upgrade options:`);
    this.log(`1. Promote (+10 reputation)`);
    this.log(`2. Expand Dormitory (+1 capacity)`);

    // 예시 처리 (모두 실행)
    this.reputation += 10;
    this.capacity += 1;
    this.log(`📢 Promotion → Reputation +10`);
    this.log(`🏠 Dormitory expanded → Capacity +1`);
  }

  handleNight() {
    this.log(`\n[🌙 NIGHT] Quest results`);
    this.quests.forEach((quest, i) => {
      const success = Math.random() < 0.8; // 80% 성공률
      if (success) {
        this.gold += quest.reward;
        this.reputation += quest.difficulty * 2;
        this.log(`✅ ${quest.id} succeeded! +${quest.reward}G, +${quest.difficulty * 2} reputation`);
      } else {
        this.log(`❌ ${quest.id} failed. No reward.`);
      }
    });

    this.log("\n💼 Final Guild Status:");
    this.log(`Gold: ${this.gold}, Reputation: ${this.reputation}, Capacity: ${this.capacity}, Adventurers: ${this.adventurers.length}`);
    this.nextDay();
  }

  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
