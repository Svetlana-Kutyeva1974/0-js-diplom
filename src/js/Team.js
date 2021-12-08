export default class Team {
    constructor() {
        this.members = new Set();
      }
    
      add(person) {
        if (!this.members.has(person)) {
          this.members.add(person);
        } else {
          throw new Error('Персонаж уже входит в команду');
        }
      }
    
      addAll(...persons) {
        for (const user of persons) {
          this.members.add(user);
        }
      }
    
      toArray() {
        return [...this.members];
      }
    }
}
