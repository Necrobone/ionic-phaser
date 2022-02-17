export class Human {
    public name: string; // * Name that the blacksmith will receive

    constructor(data?: Human) {
        console.log('Data Access Model', 'human.class', 'constructor()', data);
        Object.assign(this, data);
    }

    /**
     * * Builds respective class asynchronously
     *
     * @param serializedData data for a single object
     * @returns Promise<Human>
     */
    public static async build(serializedData?: Human): Promise<Human> {
        const tempObject = new Human(serializedData);
        try {
            console.log('Data Access Model', 'human.class', 'Human created');
            return tempObject;
        } catch (e) {
            console.error('Data Access Model', 'human.class', 'Error creating Human');
        }
    }
}
