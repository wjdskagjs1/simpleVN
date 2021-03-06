const state = {
    currentScene: 'scene0',
    currentPage: 0,
};
function Page({ buttons, name, msg, bg, actor}){
    let newButtons = buttons.split('|');

    if(buttons !== ''){
        newButtons.forEach((element, index)=>{
            const caption = element.split('->')[0];
            let scene = state.currentScene;
            let page = state.currentPage+1;
            if(element.split('->')[1] && element.split('->')[1].split('(')[1]){
                scene = element.split('->')[1].split('(')[0];
                page = parseInt(element.split('->')[1].split('(')[1].replace(')',''));
            }
            newButtons[index] = {
                caption: caption,
                scene: scene,
                page: page,
            }
        });
    } else {
        newButtons = [];
    }
    return {
        buttons: newButtons,
        name: name,
        msg: msg,
        bg: bg,
        actor: actor,

    }
}
function goto(sceneName, pageNumber){
    if(state.currentScene !==  sceneName){
        state.currentScene = sceneName;
    }
    axios.get('/scene/'+sceneName)
    .then((response) => {
        const { data } = response;
        if(data[pageNumber] === undefined){
            alert('마지막 페이지입니다.');
            return;
        }
        render(
            Page({
                buttons: data[pageNumber][0] || '',
                name: data[pageNumber][1] || '',
                msg: data[pageNumber][2] || '',
                bg: data[pageNumber][3] || '',
                actor: data[pageNumber][4] || '',
            })
        );
    })
    .catch((error) => {
        console.log(error);
    });
}
function render({buttons, name, msg, bg, actor}){
    const buttonsBox = document.getElementById('buttonsBox');
    const nameBox = document.getElementById('nameBox');
    const msgBox = document.getElementById('msgBox');
    const bgBox = document.getElementById('bgBox');
    const actorBox = document.getElementById('actorBox');

    buttonsBox.innerHTML = '';
    buttonsBox.style.display = 'none';
    buttons.forEach((element)=>{
        buttonsBox.style.display = '';
        buttonsBox.innerHTML += `<button type='button' class='choose_button' onclick='goto("${element.scene}", ${element.page})'>${element.caption}</button>`;
    });
    if(name === ''){
        nameBox.style.display = 'none';
    }else{
        nameBox.style.display = '';
    }
    nameBox.textContent = name;

    if(msg === ''){
        msgBox.style.display = 'none';
    }else{
        msgBox.style.display = '';
    }
    msgBox.textContent = msg;
    bgBox.src = bg;
    actorBox.src = actor;
    actorBox.onload = () => {
        actorBox.style.left = (1280-parseInt(actorBox.naturalWidth))/2+'px';
    }
}

window.onload = () => {
    goto(state.currentScene, state.currentPage);
    document.getElementById('bgBox').addEventListener('click', () => {
        goto(state.currentScene, ++state.currentPage);
    });
};