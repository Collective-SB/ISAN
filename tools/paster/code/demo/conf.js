const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
let demo = [
    "Just wanted to show off this new yolol paster\nI now have an everlasting burning hatred for windows api...",
    "It can dynamically switch out scripts\nand even allows you to specify automatically incrementing replacers",
    `For example: ${alpha2(0)}\n${alpha2(1)}\n${alpha2(2)}\n`,
    `For example: ${alpha2(3)}\n${alpha2(4)}\n${alpha2(5)}\n`

]

let rickroll = [
"We're no strangers to love",
"You know the rules and so do I",
"A full commitment's what I'm thinking of",
"You wouldn't get this from any other guy",
"",
"I just wanna tell you how I'm feeling",
"Gotta make you understand",
"",
"Never gonna give you up",
"Never gonna let you down",
"Never gonna run around and desert you",
"Never gonna make you cry",
"Never gonna say goodbye",
"Never gonna tell a lie and hurt you",
"",
"We've known each other for so long",
"Your heart's been aching but you're too shy to say it",
"Inside we both know what's been going on",
"We know the game and we're gonna play it",
"And if you ask me how I'm feeling",
"Don't tell me you're too blind to see",
"",
"Never gonna give you up",
"Never gonna let you down",
"Never gonna run around and desert you",
"Never gonna make you cry",
"Never gonna say goodbye",
"Never gonna tell a lie and hurt you",
"",
"Never gonna give you up",
"Never gonna let you down",
"Never gonna run around and desert you",
"Never gonna make you cry",
"Never gonna say goodbye",
"Never gonna tell a lie and hurt you",
"",
"Never gonna give, never gonna give",
"(Give you up)",
"",
"We've known each other for so long",
"Your heart's been aching but you're too shy to say it",
"Inside we both know what's been going on",
"We know the game and we're gonna play it",
"",
"I just wanna tell you how I'm feeling",
"Gotta make you understand",
"",
"Never gonna give you up",
"Never gonna let you down",
"Never gonna run around and desert you",
"Never gonna make you cry",
"Never gonna say goodbye",
"Never gonna tell a lie and hurt you",
"",
"Never gonna give you up",
"Never gonna let you down",
"Never gonna run around and desert you",
"Never gonna make you cry",
"Never gonna say goodbye",
"Never gonna tell a lie and hurt you",
"",
"Never gonna give you up",
"Never gonna let you down",
"Never gonna run around and desert you",
"Never gonna make you cry",
"Never gonna say goodbye",
]

let rrcounter = 0;

module.exports = {
    chips: [ "blank.yolol" ],
    replaceables: [
        "hello=0"
    ],

    state: {
        chip: "blank.yolol",
        counter: 0,
        //replacements: ["id=1", ]...
    },

    next: (state, replaceables)=>{
        let i=state.counter-1;
        if(i<4){
            state.replacements[0] = demo[i]
        } else if(rrcounter<rickroll.length) {
            let builder = [];
            for(let i=0; i<20; i++){
                if(rrcounter<rickroll.length){
                    builder.push(rickroll[rrcounter++]);
                } else {
                    break;
                }
            }
            state.replacements[0] = builder.join('\n');
        } else {
            state.replacements[0] = "wow, you made it to the end!";
        }
        return state;
    }
}


function alpha2(i){
    return chars[Math.floor(i/26)] + chars[i%26];
}

