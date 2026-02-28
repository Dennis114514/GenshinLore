const navPageMap = {
    'home': 'main.html',
    'basic': 'basiclore.html',
    'history': 'Teyvathis.html',
    'nations': 'history-country.html',
    'brief': 'genshinbasichis.html',
    'about-manual': 'about.html',
    'about-site': 'aboutsite.html'
};


function goToMain() {
    const currentPage = window.location.href;
    if (!currentPage.includes('main.html')) {
        const basePath = getBasePath();
        window.location.href = basePath + 'main.html';
    }
}

window.goToMain = goToMain;

document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.nav-indicator');

    function updateIndicator(item) {
        const itemWidth = item.offsetWidth;
        const itemLeft = item.offsetLeft;
        
        indicator.style.width = itemWidth + 'px';
        indicator.style.left = itemLeft + 'px';
    }

    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            updateIndicator(this);
        });
    });

    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        updateIndicator(activeItem);
    }

    window.addEventListener('resize', function() {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            updateIndicator(activeItem);
        }
    });

    const quoteData = {
        'quote1': {
            content: '<p>「我曾见，无光的终焉如纺锤般，撕裂星团璀璨的丝弦」</p><p>「我曾见，无序的冷潮吞没歌谣，让善与恶同归于寂寥」</p><p>「即便如此，我哀怜而温柔的王，你仍不愿抛却臣民吗」</p><p>「将这注定毁灭的世界弃置于此，与我一同踏上旅途吧」</p>'
        },
        'quote2': {
            content: '<p>「来自遥远世界的朋友啊，感谢你向我训示天外的事理」</p><p>「但在你眼中蒙昧的生灵，于我却是天地间全部的意义」</p><p>「若是湮灭之潮终将来袭，我的骨亦能筑起世界的护堤」</p><p>「请你见证我选择的道途，我将引领众生一同行往群星」</p>'
        },
        'quote3': {
            content: '<p><strong>树的比喻：</strong></p><p>王（法涅斯）的园丁（疑似纳贝里士）<span class="has-footnote"><sup>1</sup><span class="tooltip">编者注：关于园丁，参见本手册其他内容中的《树的比喻中的园丁是谁？》</span></span>与御园的树精相爱。但是国王想要新修凉亭的雕梁，需要砍伐最有灵气的那一棵灵木。国王是原初的那位之化身，因此园丁无法违逆万王之王，唯有对着国王的祭司祈祷。</p><p>祭司乃是常世大神（伊斯塔露）的化身。祭司怜悯园丁，于是说，你去折下灵树的枝条吧。园丁便去折枝，然后听从国王的命令砍伐了灵木。随后祭司说，你去种下灵木的枝吧。园丁说，灵木长成，需要五百年。祭司说，一念则千劫尽.</p><p>于是园丁在自家后院种下了树枝。结果一瞬间，细枝长成了新树，那新树精是曾经树精的延续。因为那时刻之神，可以把「种子」的「这一刻」带过去与未来。</p>'
        },
        'quote4': {
            content: '<p>「若罪愆源于求知，则蒙昧才是圣训；若罪愆源于抗争，则羔羊方为完人。」</p><p>「若罪愆需以血偿，何言罪源于人身？若律法完美无瑕，又何必畏惧诘问？」</p>'
        },
        'quote5': {
            content: '<p>「渎神的辩士啊，若是你当真如你的巧言那般，坚信深罪不过是凡人的妄念」</p><p>「那便由你饮下这烈怒的苦酒，去往苍银之树，向那谴罚于我等的御使申辩」</p>'
        },
        'quote6': {
            content: '<p>「可叹，可叹，你们的主宰竟会如此亵渎这些高洁的生命」</p><p>「即便是折磨灵魂为乐的血魇魔，也会为这般的暴行而惊愕」</p><p>「从未知晓何为爱的拂晓少女啊，就让我与你的律法为敌」</p><p>「为你的主宰所囚禁的众多生灵，理应仰起头来望向群星」</p>'
        },
        'quote7': {
            content: '<p>「那便让我成为你的剑，你的盾，你的引路人，你不可饶恕的悖逆共谋」</p>'
        },
        'quote8': {
            content: '<p>「来吧，来吧…让我们以骸骨重塑荒谬的规则，以血浇灌北地的荒瘠」</p><p>「让我们造一座城和一座高耸入云的露，让地上人不必再为苦厄饮泣」</p><p>「让我将这无用的冠冕弃入尘埃，让尘世的列邦换得挣脱枷锁的一息」</p>'
        },
        'quote9': {
            content: '<p>「法度不可试探，律例不可质疑，典章不可违弃。」</p><p>「我曾如此笃信，我曾如此告启，我曾如此传谕。」</p><p>「直至温柔的星光拭过我的眼瞳，」</p><p>「在白石的吟咏之山上向我显明，」</p><p>「我才愿向你们述说明晨的图景。」</p>'
        },
        'quote10': {
            content: '<p>「屈从于原初之主的兄弟姐妹们呀，我要将我见证的实在告诉你们。」</p><p>「你们有人注定流离于无月的黑夜，饮尽苦泪也难挽回凋殒的亲族，」</p><p>「有人注定要在镀金的沙漠中跋涉，终生无从知晓何为赤忱与眷慕。」</p><p>「有人注定瑟缩于暗处刺骨的敌意，等待海潮如约揭起乐章的终幕，」</p><p>「有人注定只能彷徨于梦中的旅路，于凝滞的异乡躭待未至的相遇。」</p><p>「无论如何哀求——无论如何奉献，都不能为你们解下缚颈的羁绊。」</p>'
        },
        'quote11': {
            content: '<p>「既然如此，你们真正所希冀的梦，可是弃绝心底无法言说的悸动？」</p><p>「如往常般沉堕于无始无终的永恒，为那些虚伪的许诺而犯下暴行？」</p><p>「是故——」</p><p>「委弃吧，悖逆吧，浸羽翼于泥淖，让胸中炽灼的爱欲如焚火盛放，」</p><p>「渴求吧，祝愿吧，委世界于众生，让万国的荣华盖过高天的威光，」</p><p>「讴歌吧，喝彩吧，赐权能于灵长，让月芒的枪刺破创造主的狂想。」</p><p>「向着那无垢的苍耀黎明伸出手吧，让列邦不必再哀求存续的允准，」</p><p>「抬起头来仰望苍耀的拂晓之星吧，让我引你们一同行往新的天穹。」</p>'
        },
        'quote12': {
            content: '<p>「与爱为敌的支配者总会有其动摇之刻，」</p><p>「面纱破碎时迎向大地的是崭新的曙光。」</p>'
        },
        'quote13': {
            content: '<p>历代的主祭在生涯的最末都看到了同样的景象：遍地礼冠堆积在秘境之中，枯木之下。每一件的背后都是用一生保守的秘密。每一任主祭退任后都将无暇的白枝编成的礼冠，奉还给这个世界。每个曾经宏伟的古都与肃穆的祭祀场，最终都会回归深邃的大地.</p><p>一切繁荣当然都有终结。但是这不代表没有永恒。在循环的终点，大地会再度迎来春生。因此，「永恒」是环形的。「求索真相」是繁荣所带来的智识，而不是催生繁荣所需的种子。</p><p>曾经有一个时代，大地上的人们还能直接听到来自天空岛的启示。神的使者走在蒙昧的人当中。彼时万物的气息渐弱，大地永冻。</p>'
        },
        'quote14': {
            content: '<p>第一天你（尼伯龙根）锻出月色闪耀的金弓，要射落你的仇敌，那弓却在你出猎时为窃贼所盗，成了你仇敌之物。</p>'
        },
        'quote15': {
            content: '<p>第二天你锻出月色闪耀的高车，要护守你的家府，那车却在你出猎时为窃贼所盗，成了你仇敌之物。</p>'
        },
        'quote16': {
            content: '<p>第三天你锻出月色闪耀的梭杼，要求娶繁星之女，却终因冒失而坠入多雾的泥沼，熄了光明的锻炉。</p>'
        },
        'quote17': {
            content: '<p>「我看见，地上的列国不必再渴求天空的垂怜」</p><p>「他们筑起的城要升到云上，高过王座与众星」</p><p>「我看见，人要与他们所敬畏的诸神平分苍穹」</p><p>「不再有泪水、悲伤与死亡，因一切已然完成」</p>'
        },
        'quote18': {
            content: '<p>「但后来，入侵者自天穹之外而来，破灭毁坏众多，江河倒转，恶疫横行…」</p><p>「自外而来者为我曾经的族人带来了战争，亦为大地带来突破桎梏的妄想…」</p>'
        }
    };

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    function openModal(quoteId) {
        const text = quoteData[quoteId];
        if (text) {
            modalBody.innerHTML = text.content;
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('modal-active');
            }, 10);
        }
    }

    function closeModalFunc() {
        modal.classList.remove('modal-active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    document.querySelectorAll('.quote-block').forEach(block => {
        block.addEventListener('click', function() {
            const quoteId = this.getAttribute('data-quote');
            openModal(quoteId);
        });
    });

    closeModal.addEventListener('click', closeModalFunc);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModalFunc();
        }
    });
});
