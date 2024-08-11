const fs = require('fs');
// File to contain mutations to quest.json

const RUN_MUTATIONS = [
  false, // Mutation 1 - Monster XP adjustments
  true, // Mutation 2 - Adding startingQuestId to fields without it
]

/*
  ! Mutation 1 - adjust totalXP to account for monsters. For side quests, this will be met with a conservative 22%
  ! (if following campaign ratios, it would be 28%)
*/
if (RUN_MUTATIONS[0]) {
  const questData = JSON.parse(fs.readFileSync('./quest_3.json', 'utf-8'));
  
  const output = questData.map(zone => {
    return zone.map(quest => {
      if (quest.monsterAdjustment) {
        return quest;
      } else {
        return {
          ...quest,
          // Only adjust slightly for quests with 1 step. These are usually rare monster quests, or other niche one-offs that
          // don't have a lot of monsters being killed in them
          totalXP: Math.floor(quest.totalXP * (quest.questSteps === 1 ? 1.1 : 1.20)),
          monsterAdjustment: true,
        }
      }
    })
  })
  
  fs.writeFileSync('./quest_4.json', JSON.stringify(output, null, 2), 'utf-8');
}
// ? End of Mutation 1

/*
  ! Mutation 2 - add the startingQuestId field to any questline object that does not have it,
  ! as to do manual work getting those ids in place for real
*/
if (RUN_MUTATIONS[1]) {
  const questData = JSON.parse(fs.readFileSync('./quest_4.json', 'utf-8'));
  
  const output = questData.map(zone => {
    return zone.map(quest => {
      if (quest.startingQuestId || quest.name === 'Zone Campaign') {
        return quest;
      } else {
        return {
          ...quest,
          startingQuestId: 1234567890
        }
      }
    })
  })
  
  fs.writeFileSync('./quest_5.json', JSON.stringify(output, null, 2), 'utf-8');
}
// ? End of Mutation 1