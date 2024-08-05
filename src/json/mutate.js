const fs = require('fs');
// File to contain mutations to quest.json

/*
  Mutation 1 - adjust totalXP to account for monsters. For side quests, this will be met with a conservative 22%
  (if following campaign ratios, it would be 28%)
*/
const questData = JSON.parse(fs.readFileSync('./quest.json', 'utf-8'));

const output = questData.map(zone => {
  return zone.map(quest => {
    if (quest.monsterAdjustment) {
      return quest;
    } else {
      return {
        ...quest,
        // Only adjust slightly for quests with 1 step. These are usually rare monster quests, or other niche one-offs that
        // don't have a lot of monsters being killed in them
        totalXP: Math.floor(quest.totalXP * (quest.questSteps === 1 ? 1.1 : 1.22)),
        monsterAdjustment: true,
      }
    }
  })
})

fs.writeFileSync('./quest_1.json', JSON.stringify(output, null, 2), 'utf-8');