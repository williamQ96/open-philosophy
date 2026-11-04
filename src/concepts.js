export const concepts = [
 {id:'sisyphus',number:'01',tag:'荒诞 · ABSURD',title:'西西弗斯',english:'The Myth of Sisyphus',question:'如果终点永远无法抵达，过程还有意义吗？',description:'诸神罚西西弗斯将巨石推上山顶，巨石却一次次滚落。加缪在这个循环中看到人的处境：世界并不回答我们对意义的渴望。',reflection:'意识到荒诞之后，反抗、自由与热情仍然可能。想象西西弗斯在下山途中，重新选择自己的命运。',source:'阿尔贝·加缪，《西西弗神话》（1942）',hint:'拖动旋转视角 · 滚轮缩放',control:'循环速度'},
 {id:'panopticon',number:'02',tag:'权力 · POWER',title:'环形监狱',english:'The Panopticon',question:'当你不知道自己是否被注视，还会如何行动？',description:'边沁设计的环形监狱将牢房围绕一座中央瞭望塔。囚徒可被看见，却无法确认看守是否正在观察。',reflection:'福柯借此分析现代纪律权力：持续可见的可能性，如何让外在的监视转化为自我约束？这是一种思想模型，而非对所有监狱的历史复原。',source:'杰里米·边沁，《全景敞视主义书简》（1791）；米歇尔·福柯，《规训与惩罚》（1975）',hint:'拖动旋转视角 · 滚轮缩放',control:'观察光束'}
];
export function getConcept(id){return concepts.find(c=>c.id===id) ?? concepts[0]}
