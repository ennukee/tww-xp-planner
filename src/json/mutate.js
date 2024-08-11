const fs = require('fs');
// File to contain mutations to quest.json

/*
  ----------------------------------------------------------------------------------------------------------------------------------
  ! CONFIGURATION
  * Change these values to configure the script i/o
  ----------------------------------------------------------------------------------------------------------------------------------
*/

const RUN_MUTATIONS = [
  false, // Mutation 1 - Monster XP adjustments
  false, // Mutation 2 - Adding startingQuestId to fields without it
  false, // Mutation 3 - Add mapCoord field
]

const INPUT_FILE = './quest.json';
const OUTPUT_FILE = './quest.json';

/* 
  ----------------------------------------------------------------------------------------------------------------------------------
  ! PRE-SCRIPT HALTS
  * These are checks that are run before the script actually does anything. If any of these checks fail, the script will halt
  ----------------------------------------------------------------------------------------------------------------------------------
*/

// If more than one mutation is active, halt the script
if (RUN_MUTATIONS.filter(m => m).length > 1) {
  throw new Error('Only one mutation can be active at a time');
}

// If either input or output file does not exist, halt the script
if (!fs.existsSync(INPUT_FILE)) {
  throw new Error(`Input file ${INPUT_FILE} does not exist`);
}
if (!fs.existsSync(OUTPUT_FILE)) {
  throw new Error(`Output file ${OUTPUT_FILE} does not exist`);
}

// If output file already exists, prompt user for confirmation before continuing. Halt if they do not confirm
if (fs.existsSync(OUTPUT_FILE)) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question(`Output file (${OUTPUT_FILE}) already exists. Overwrite? (y/n) > `, response => {
    if (response.toLowerCase() !== 'y') {
      console.log('Exiting...');
      process.exit(0);
    }
    readline.close();
  });
}

/* 
  ----------------------------------------------------------------------------------------------------------------------------------
  ----------------------------------------------------------------------------------------------------------------------------------
*/

/*
  ! Mutation 1 - adjust totalXP to account for monsters. For side quests, this will be met with a conservative 22%
  ! (if following campaign ratios, it would be 28%)
*/
if (RUN_MUTATIONS[0]) {
  const questData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  
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
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
}
// ? End of Mutation 1

/*
  ! Mutation 2 - add the startingQuestId field to any questline object that does not have it,
  ! as to do manual work getting those ids in place for real
*/
if (RUN_MUTATIONS[1]) {
  const questData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  
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
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
}
// ? End of Mutation 2

/*
  ! Mutation 3 - add mapCoords field to any questline object that does not have it, defaulting to 0,0
*/
if (RUN_MUTATIONS[2]) {
  const questData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  
  const output = questData.map(zone => {
    return zone.map(quest => {
      if (quest.mapCoords || quest.name === 'Zone Campaign') {
        return quest;
      } else {
        return {
          ...quest,
          mapCoords: {
            x: 0,
            y: 0,
          }
        }
      }
    })
  })
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
}
// ? End of Mutation 3