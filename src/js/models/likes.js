export default class Like{
    constructor()
    {
        this.likes = [];
    }
    addLike(id, title, publisher, img)
    {
        
        const item = {
                id,
                title,
                publisher,
                img
        };
        this.likes.push(item);
        // persist data in localstorage
        this.persistData();

        return item;
    }
    
    deleteLike(id){
        const filteredLikes = this.likes.filter(el=> el.id !== id);
        this.likes = filteredLikes;
        // persist data in localstorage
        this.persistData();

    }

    isLiked(id){
        return this.likes.findIndex(el=>el.id === id) !== -1;
    }
    getNumOfLikes()
    {
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify( this.likes));
    }
    readLocalStorage()
    {
        // might return null
        const storage = JSON.parse(localStorage.getItem('likes'));
        // restore our local data
        if(storage)
        {
            this.likes = storage;
        }

    }
}