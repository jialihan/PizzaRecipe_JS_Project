import uniqid from 'uniqid';

export default class List{
    constructor()
    {
        this.items = [];
    }
    addItem(count, unit, ingredient)
    {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    }
    deleteItem(id){
        const filteredIds = this.items.filter(el=> el.id !== id);
        this.items = filteredIds;
        // another way
        // findindex of id
        // use splice(index, 1)
    }
    updateCount(id, newCount){
        this.items.find(el=> el.id === id).count = newCount;
    }
}