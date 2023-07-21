export const useNode = ()=>{
    const insertNode = (tree,commentId,item)=>{
        if(tree.id==commentId){
            tree.items.push({
                id:new Date().getTime(),
                name: item,
                items: []
            });
            return tree;
        }
        let latestNode=[];
        latestNode=tree.items.map((ob)=>{
                return insertNode(ob,commentId,item);
        })
        return {...tree,items: latestNode}
    }
    const editNode=(tree,commentId,value)=>{
        if(tree.id===commentId){
            tree.name=value;
            return tree;
        }
        tree.items.map((ob)=>{
            return editNode(ob,commentId,value);
        });
        return {...tree};
    }
    const deleteNode=(tree,id)=>{
        for(let i=0;i<tree.items.length;i++){
            const currItem=tree.items[i];
            if(currItem.id===id){
                tree.items.splice(i,1);
                return tree;
            }
            else {
                deleteNode(currItem,id);
            }
        }
        return tree;
    }
    return {insertNode,editNode,deleteNode};
}