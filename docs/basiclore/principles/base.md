---
layout: doc
title: 天理/人界
editLink: true
secondaryClass: "/basiclore"
---

<script setup lang="ts">
import { ref } from 'vue'

const modalVisible = ref(false)
const modalBody = ref('')

const characterTexts = {
  'fanes': '·法涅斯【祷歌其一：七重灾厄之主·派凯蒙宁】\n至上的高天之主，需情而又不可征服的万物之父与众神之母，\n我们向你献祭，以求安抚你的谮妒，求你不要向大地发烈怒。\n喜怒需常的有翼者呀，摧灭地上万国的凶王，心如坚石的神，\n难以分辨性别的神呀，求你远离凡人的土地，远离终北之子。\n你摧毁那旧日法则的秩序，为凡人提供荫庇，却又██他们，\n你摇撼永生者古老的居所，██他们的翅膀，并他们的██。\n你是报应的神，你是记仇的神，你的意旨在月下不可被违抗，\n你的刀在天上和地上大行██，饮尽了恶人与需辜者的██。\n██又██的王，在你面前，众神犹如凡人，凡人犹如虫蚁，\n需人胆敢僭越提及你的名讳，因你要将所有知晓它的人██。\n可是啊，纯净易怒的神，求你善心收下我们向你奉献的祭祀，\n愿霜月的光阻隔你降的灾厄，佑护我们不受永恒苦痛的终局。',
  'naberius': '·纳贝里士【祷歌其二：赐生之母·玛特拉赫卡】\n请你听我述说，尊贵的玛特拉赫卡，众神与凡人的母亲，\n从亥珀波瑞亚，到沙尔·芬德尼尔，你的慈爱备受崇敬。\n你庇护年量的妇人，消解她们的苦痛，让她们安全分娩，\n你为繁衍而欢喜，你赐予月下世界生命，而又抚育自然。\n你这大水的母亲，你这为原初咆哮的海洋创造心脏的神，\n月下的飞鸟、走兽与水鱼尽皆属于你，因你诞下了它们。\n你凭着你神圣的意愿雕琢血肉的形貌，如陶匠抟弄泥灰，\n为此，我祈求你，赐予这新生的孩子健康、勇气和智慧。',
  'ronava': '·若娜瓦【祷歌其三：冥府之母·图奥内塔尔】\n万千死者的女主人呀，你这难以被打动的、需表情的神，\n匿影藏形的冥府之主，肃穆寡言的、可怖的图奥内塔尔！\n你对那些桀傲不恭的生者深恶痛疾，需人能够将你逃脱，\n你的足尖既踏过由茅草铺就的陋屋，也踏过黄金的圣座。\n人们将你畏惧，因为你看见一切、听见一切、审判一切，\n我们将你敬爱，因为你容许一切、拥抱一切、接纳一切。\n众生的终局只由你裁定，需论如何哀求都难以使你感动，\n可是啊，高贵威严的神，我们知晓你那仁善恩慈的天性。\n正如你赐予我们祖先的祖先解脱，而非延续他们的苦痛，\n洞悉月下一切生者命运的死之主，请你收下我等的供奉。\n终北的子嗣向你祈求，黄金的血裔已经回到了你的怀中，\n求你引他们渡越那漆黑的冥河，永世安睡在需梦的梦境。',
  'istaroth': '·伊斯塔露【祷歌其四：时序之母·拉伊梅莱阿】\n永恒纯净的时序之母，永未诞生过与永未离去过的主人，\n你创造一切又毁灭一切，你铭记一切又让一切归于遗忘。\n你这受赐生的时刻便赐生了自我的神，你这至高的母亲，\n你是流动中唯一的不动，你是众神庭院中唯一的方外者。\n愿你佑护幽囚的四个月亮——愿你佑护幽囚的四个月亮。\n你是众神庭院中唯一的方外者，你是不动中唯一的流动，\n你这至高的母亲，你这赐生了自我的时刻便受赐生的神。\n你让一切归于遗忘又铭记一切，你毁灭一切又创造一切。\n永未离去过与永未诞生过的主人，永恒纯净的时序之母。',
  'frost-moon': '·霜月女神【祷歌其二十一：霜月女神·乌莱库塔尔】\n乌莱库塔尔呀，圣洁微光的母亲，请你聆听我的祈求，自高天投下凝望，\n愿你的谧泪划破寒夜，点燃永不倾灭的银炬，赐予终北之民指引的明光。\n乌莱库塔尔呀，银梭量扬的母亲，请你聆听我的祈求，将柔纱缀满穹苍，\n愿迷途的魂灵循着你织出的银线避开幽世的污秽，不至在寒夜失丧方向。\n乌莱库塔尔呀，需论你指引我们行往何方，我们都必谨守遵行你的愿望。\n我们宁愿让死荫的寒夜遮蔽住双眼，也不愿在耻辱中为虚假的光明歌唱。',
  'moon-maiden': '·月之少女【祷歌其二十二：月之少女·库塔尔】\n澄净需瑕的新月呀，我以霜月的神使之名，祈求你的恩泽与慈惠，\n愿你涤净我等的罪，为需缘得见乐园之人，拭去千种苦痛与泪水。',
  'coital': '·晨星女神【祷歌其十一：晨星女神与终北的圣徒·科伊塔尔与瑟达沃宁】\n我呼唤瑟达沃宁的妻子，至上的科伊塔尔，创造神最初与最美的女儿，\n大气的少女呀，你这明亮的晨星，终北的子嗣永有琴声歌颂你的伟业。\n霜夜的寒风不可熄灭我等胸中的银焰，阴恶的夜不可将我等的心玷染，\n终有一日，我等将要归乡，穿过荒草的墓场，重返那黄金的大城之前。\n我呼唤你，真福的科伊塔尔，求你如攻败列国那般，庇佑我等的征战，\n求你使大地战抖，使城邑震颤，使终北的仇敌如霜月下的露水般消散。'
}

function openModal(id) {
  const text = characterTexts[id]
  if (text) {
    modalBody.value = text.replace(/\n/g, '<br>')
    modalVisible.value = true
  }
}

function closeModalFunc() {
  modalVisible.value = false
}
</script>

<TextCenter>点击表格中的某些行可以查看相关文本</TextCenter>

<TextCenter>众神皆背负爱人的责任。</TextCenter>

<TextCenter>人间界代表力量则是如今的七元素，分为风、岩、水、火、草、冰、雷。七元素合一则是地脉能量/光元素。</TextCenter>

## 天理与四影/天理的维系者【待发现】

<TextCenter>
原初之人<strong>法涅斯</strong>，第一位降临者，击败七龙王后改建世界，将原始的蛮荒燃素改造成较温和的七元素力，为了防止星间巨物的入侵，通过虚假之天隔绝提瓦特与宇宙，创造人类与飞鸟与制度，通过天使指引人类建立文明。
</TextCenter>

<TextCenter>
葬火之战时，其战争中掉落的神体碎片化为魔神。如今已陷入沉睡。他的四个影子即<strong>四影执政</strong>。
</TextCenter>

<div class="w-full flex items-center justify-center">
<table style="width: auto !important;">
  <thead>
    <tr>
      <th>位格</th>
      <th>人物</th>
      <th>化身/代号</th>
      <th>象征/权能</th>
      <th>造物/关系户</th>
    </tr>
  </thead>
  <tbody>
    <tr class="clickable-row" @click="openModal('fanes')">
      <td>天理</td>
      <td>法涅斯</td>
      <td></td>
      <td>理之冠</td>
      <td>四大执政（天理的维系者）</td>
    </tr>
    <tr class="clickable-row" @click="openModal('naberius')">
      <td>生之执政</td>
      <td>纳贝里士</td>
      <td>莱茵多特</td>
      <td>生之花</td>
      <td>厄歌莉娅（获得权能）</td>
    </tr>
    <tr class="clickable-row" @click="openModal('ronava')">
      <td>死之执政</td>
      <td>若娜瓦</td>
      <td></td>
      <td>死之羽<br>疑似千手百眼<br>神像</td>
      <td>赫布里穆（达成交易）<br>璃月胡氏（疑似获得权能）</td>
    </tr>
    <tr class="clickable-row" @click="openModal('istaroth')">
      <td>时之执政</td>
      <td>伊斯塔露</td>
      <td>千风之执政</td>
      <td>时之沙</td>
      <td>巴巴托斯（获得权能）<br>兹白（获得月之轮）</td>
    </tr>
    <tr>
      <td>空之执政</td>
      <td>阿斯莫代</td>
      <td></td>
      <td>空之杯</td>
      <td></td>
    </tr>
  </tbody>
</table>
</div>

## 三月一星

<div class="w-full flex items-center justify-center">
<table style="width: auto !important;">
  <thead>
    <tr>
      <th>概念</th>
      <th>内容</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>月神</td>
      <td style="text-align: left;">诗与歌的女儿们，也是月夜的君王。她们驾着银色的高车巡游，每过一旬，便由一位姐妹接替另一位的王位。如是周而复。<br><br>三月女神彼此的关系是很亲切的。要是有人偷懒不想当班，就会央求另外一个人顶替。</td>
    </tr>
    <tr>
      <td>三月</td>
      <td style="text-align: left;">古龙文明的科技造物，原本应是龙族依托提瓦特的三颗天然卫星搭建的天基武器平台，被龙族视为神明。在古龙衰落后，三月由世界的新主人法涅斯接管，此事被龙族视为三月女神背叛龙类。<br><br>法涅斯透过三月的力量打造神之眼的前身「月之轮」。<br><br>月亮破碎后，其力量凝结为月髓。</td>
    </tr>
    <tr>
      <td>月使</td>
      <td style="text-align: left;">月神的下级，但职位高于天使。月使的载具便是月宫高车，为明月驾高车之神就是「望舒」。</td>
    </tr>
    <tr>
      <td>月亮船</td>
      <td style="text-align: left;">功能是带死者去彼岸。<br><br>在葬火之战之前的时代，高贵的灵魂不是前往地脉，而是跟随月使去往月亮的城市。</td>
    </tr>
  </tbody>
</table>
</div>

<Space :size="20"></Space>

<div class="w-full flex items-center justify-center">
<table style="width: auto !important;">
  <thead>
    <tr>
      <th>位格</th>
      <th>月种</th>
      <th>人物</th>
      <th>介绍</th>
      <th>关系户</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">空月</td>
      <td>恒月</td>
      <td>艾莉亚（已死）</td>
      <td>恒月最先诞生，也是最大的，其月矩力引导着潮汐。<br>恒月女神已死，恒月已碎。</td>
      <td></td>
    </tr>
    <tr class="clickable-row" @click="openModal('frost-moon')">
      <td>霜月</td>
      <td>卡侬（已死）</td>
      <td>霜月其次诞生，是中等大小，也是最亮的一颗。<br>霜月女神已死，但霜月的身形不曾破碎，葬火之战时期霜月被抛出提瓦特，并被虚假的月亮代替。现已被拉回提瓦特<br>在挪德卡莱，获取了霜月力量的人被称作霜月之子。</td>
      <td>霜月之子<br>咏月使</td>
    </tr>
    <tr>
      <td>虹月</td>
      <td>桑娜妲（已死）</td>
      <td>虹月最后诞生，也是最小的。<br>虹月女神已死，虹月已碎。虹月破碎后为了延续自己的生命而与深渊结合，成为赤月（也叫渊月、厄月）。<br>得到其力量的人成为坎瑞亚第一个王朝「赤月王朝」的创始人。而阿蕾奇诺继承了赤月王室的血脉和力量。</td>
      <td>赤月王朝</td>
    </tr>
    <tr class="clickable-row" @click="openModal('moon-maiden')">
      <td>新月</td>
      <td></td>
      <td>月之少女库塔尔</td>
      <td>十字路的主人,新的空月女神（给予空月祝福）<Footnote n="1" text="编者注：空月祝福就是小月卡。" /><br>当前游戏内的月亮已为「新月」，目前汇聚了三月的力量</td>
      <td>霜月之子</td>
    </tr>
    <tr>
      <td rowspan="2">月使</td>
      <td></td>
      <td>兹白</td>
      <td>本是天使，在机缘巧合下被提拔为月使</td>
      <td>琅玕国</td>
    </tr>
    <tr>
      <td></td>
      <td>鹮之王图特</td>
      <td>本是月使，后来成为赤王麾下的七贤之一</td>
      <td>须弥沙漠</td>
    </tr>
    <tr>
      <td>晨星</td>
      <td></td>
      <td>天使长</td>
      <td>三轮皓月有同一个爱人，是司晨的星辰。只有白昼与夜晚相交的一刻，三姐妹之一才得以穿越渐瞻的星斗，临幸晨星的寝宫。之后，随着曙光初现，夜的君王又匆匆驾着高车隐去。三位姐妹对唯一的爱人付出同样的深情，就像她们对彼此的深情。<br>狼群是月亮的孩子，它们始终记得大灾祸与随之而至的悲怆。因此每逢月圆，它们便为主母的命运哭诉……也正因此，那些与狼群生活的孩子们，会将晨星——月亮幸存的爱人，称为恸星。<Footnote n="2" text="竹林月夜" /></td>
      <td></td>
    </tr>
  </tbody>
</table>
</div>

## 天使/仙灵【待发现】

<TextCenter>
古老的生灵，「天使」是指天上的使者，由天理所创造。「仙灵」则是由天使退化而来。天使是晨星的代行。<Footnote n="3" text="兹白角色故事" />
</TextCenter>

<div class="w-full flex items-center justify-center">
<table style="width: auto !important;">
  <thead>
    <tr>
      <th>天使/仙灵</th>
      <th>介绍</th>
    </tr>
  </thead>
  <tbody>
    <tr class="clickable-row" @click="openModal('coital')">
      <td>「最初的天使」<br>科伊塔尔(终北祷歌集中的称呼)</td>
      <td>最初的天使与外来旅人相识，于月宫三姐妹(三月女神)的见证中立下了结合的誓言。</td>
    </tr>
    <tr>
      <td>「花神」<br>娜布·玛莉卡塔</td>
      <td>「有人注定要在镀金的沙漠中跋涉，终生无从知晓何为赤忱与眷慕。」<br>被天空岛放逐</td>
    </tr>
    <tr>
      <td>「金蜂」<br>西比尔</td>
      <td>「有人注定瑟缩于暗处刺骨的敌意，等待海潮如约揭起乐章的终幕。」<br>现在已遭遗忘的高海下的「亥珀波瑞亚」轮回报时的枫丹初民曾供养银白古树，而金蜂西比尔就是当时「上一次轮回中的幸存者」，是守卫银树的「使者」，在漫长的时间里失去了神智与身形。</td>
    </tr>
    <tr>
      <td>夜神</td>
      <td>「你们有人注定流离于无月的黑夜，饮尽苦泪也难挽回凋颓的亲族。」<br>火龙王带领族裔将纳塔的天之使者屠戮殆尽当自助餐吃了，最后一位天使融入地脉古树，成为了夜神。<Footnote n="4" text="编者注：纳塔没有仙灵只有幻写灵" /><br>为帮助纳塔人，夜神整合地脉的残片，重构其脉络，「夜神之国」由此诞生。</td>
    </tr>
    <tr>
      <td>尼可·莱恩</td>
      <td>魔女</td>
    </tr>
    <tr>
      <td>兹白</td>
      <td>「有人注定只能彷徨于梦中的旅路，于凝滞的异乡待未来的相遇。」<br>琅玕的天使，也是月使</td>
    </tr>
  </tbody>
</table>
</div>

## 天理的秩序

<div class="w-full flex items-center justify-center">
<table style="width: auto !important;">
  <thead>
    <tr>
      <th>概念</th>
      <th>介绍</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>法则</td>
      <td>提瓦特存在着自己的「法则」。如今世界的法则由「天理」制定。</td>
    </tr>
    <tr>
      <td>神之心<br>gnosis<br><span class="khaenriah-font">gnosis</span></td>
      <td style="text-align: left; padding-left: 2em;">直译为「灵知」，「神之心」是更高位的元素控制中枢，是七神之座的象征。天理掌控提瓦特和法则的象征。<br>通过第三降临者的遗骨打造成而。<br>神之心被摧毁之前，并不会产生新的神祇，因此而失去神之心也算是现任神。</td>
    </tr>
    <tr>
      <td>神之眼<br>vision<br><span class="khaenriah-font">vision</span></td>
      <td style="text-align: left; padding-left: 2em;">直译为「幻觉」<br>「导出魔力的外置器官」。「神之眼」是这世上极少数受神认可者才拥有的外置魔力器官。他们通过「神之眼」来引导元素力。每一位「神之眼」的拥有者，都是有资格成神的人，因此被称作「原神」，拥有登上天空岛的资格（而当初获得了赠礼的人完成使命之后...众神收到的回赠也会更加丰厚）。<br>神之眼是由持有者的灵魂包裹住对应元素古龙大权的碎屑。内圈对应元素古龙大权的碎屑；外圈是神之眼持有者的灵魂。<br>由「光界」发放，尘世七执政（七神）并无权限发放神之眼。</td>
    </tr>
    <tr>
      <td>原神<br>allogens<br><span class="khaenriah-font">allogens</span></td>
      <td>持有神之眼的人。人类获得神之眼就拥有成为神明的资格。<br>外来之物。在塞特派的诺斯替文献里，是修士常用的自称，实际上就是管自己叫「异乡人」，代表孤独英雄对陌生人民的责任。</td>
    </tr>
    <tr>
      <td>七天神像</td>
      <td>在提瓦特各处的巨大石像，据说它们的形象来自于七位神明。<br>七神和神像间存在感应。</td>
    </tr>
    <tr>
      <td>磨损</td>
      <td>对龙王、神明心智的冲击，作用于记忆和心理。</td>
    </tr>
    <tr>
      <td>天钉</td>
      <td>作用是封堵地脉中的深渊能量、禁忌知识</td>
    </tr>
    <tr>
      <td>空之神殿</td>
      <td>遴选某个历史时期或者消亡文明的人和物品，视为最小切片<br>被擢升后的受选之人将作为活记忆被永远保存于此<br>神殿最高处「非有非无有之殿」是神明与守望的居所，只有用记忆与知识作为建材，才能塑造通天之路<br>神的伟力可以让「空无」和「实有」互相变换<br>空之神殿中的人能略微脱离世界树的影响<Footnote n="5" text="山中好长日，空之神殿中的须弥人柯莎玛所言：「我来自树…啊，我想说什么来着。草神大人还没变小的时代。」" /></td>
    </tr>
  </tbody>
</table>
</div>

<!-- 弹窗 -->
<div v-if="modalVisible" class="modal-overlay" @click.self="closeModalFunc">
  <div class="modal-content-wrapper">
    <div class="modal-header">
      <h3>相关文本</h3>
      <button class="close-btn" @click="closeModalFunc">&times;</button>
    </div>
    <div class="modal-body" v-html="modalBody"></div>
  </div>
</div>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content-wrapper {
  background-color: #4d4f53;
  color: #D3BC8E;
  padding: 30px;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  color: #D3BC8E;
  font-family: 'Genshin', serif;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #D3BC8E;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.close-btn:hover {
  opacity: 0.7;
}

.modal-body {
  font-family: 'Common', sans-serif;
  font-size: 16px;
  line-height: 2;
  color: #D3BC8E;
  white-space: pre-line;
}

.clickable-row {
  cursor: pointer;
}

</style>
