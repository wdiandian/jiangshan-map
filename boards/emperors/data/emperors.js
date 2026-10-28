/* 帝王谱系数据：秦—清的主线世系与并立政权
 * 字段说明：
 *   id        唯一标识（跨朝代也不重复）
 *   name      常用称谓（庙号/谥号）
 *   personal  姓名
 *   temple    庙号或尊号
 *   reign     在位年（含复辟、追尊等特殊情形）
 *   year      用于跳转地图的代表年份
 *   parent    父/母/养父的 id；跨朝代或不明时为 null
 *   relation  相对 parent 的关系：子、弟、孙、侄、养子、曾孙、玄孙、皇后称帝、宗室
 *   status    emperor（在位）| honored（追尊）| regent（临朝/摄政）| disputed（争议）
 *   era       年号（可选）
 *   note      一句话说明（可选）
 */
(function () {
  'use strict';

  const n = (id, name, personal, reign, parent, relation, extra) =>
    Object.assign({ id, name, personal, reign, parent, relation }, extra || {});
  const h = (id, title, note, nodes) => ({ id, title, note, nodes });
  const d = (id, title, span, note, houses) => ({ id, title, span, note, houses });

  window.EMPEROR_GENEALOGY = {
    updatedAt: '2026-10-28',
    note: '以《史记》《汉书》以下正史本纪与通行帝王年表为主，参以《中国历史地图集》的年代框架。追尊、临朝与短命政权以虚线标示；个别在位年与庙号有异说，卡片中随文注明。',
    dynasties: [
      d('qin', '秦', '前221—前207', '中国第一个皇帝制度。嬴政称“始皇帝”，二世而亡；子婴去帝号，在位仅四十六日。', [
        h('qin-house', '嬴姓秦室', '秦庄襄王至秦王婴。', [
          n('qin-zhuangxiang', '秦庄襄王', '嬴异人', '前249—前247', null, '追尊', { temple: '庄襄王', year: -249, status: 'honored', note: '秦始皇之父；早年质于赵，后在吕不韦运作下归秦即位。' }),
          n('qin-shihuang', '秦始皇', '嬴政', '前246—前210', 'qin-zhuangxiang', '子', { temple: '始皇帝', year: -221, era: '始皇', note: '前221年灭六国，废王号，自称始皇帝；书同文、车同轨、行郡县。' }),
          n('qin-ershi', '秦二世', '胡亥', '前210—前207', 'qin-shihuang', '子', { temple: '二世皇帝', year: -210, era: '二世', note: '沙丘之变后继位，赵高专权；前207年为赵高所弑。' }),
          n('qin-ziying', '秦王婴', '子婴', '前207', 'qin-shihuang', '孙', { temple: '秦王', year: -207, status: 'disputed', note: '扶苏之子；去帝号称秦王，在位四十六日，降刘邦，秦亡。' }),
        ]),
      ]),
      d('xihan', '西汉', '前202—8', '刘邦称帝至王莽代汉。外戚、功臣与宗室三股力量贯穿始终；前少帝、后少帝与孺子婴的正统性向有争议。', [
        h('xihan-house', '刘氏汉室', '高祖至孺子婴。', [
          n('xihan-taiqong', '刘太公', '刘煓', '前202—前197', null, '追尊', { temple: '太上皇', year: -202, status: 'honored', note: '刘邦之父；汉初尊为太上皇，是中国历史上第一位在世的太上皇。' }),
          n('xihan-gaozu', '汉高祖', '刘邦', '前202—前195', 'xihan-taiqong', '子', { temple: '太祖高皇帝', year: -202, era: '汉', note: '楚汉战争胜项羽，前202年称帝，定都长安；郡国并行。' }),
          n('xihan-huidi', '汉惠帝', '刘盈', '前195—前188', 'xihan-gaozu', '子', { temple: '孝惠皇帝', year: -195, era: '惠帝', note: '仁弱，吕后临朝；在位期间萧何、曹参相继为相，行黄老无为。' }),
          n('xihan-qianshaodi', '前少帝', '刘恭', '前188—前184', 'xihan-huidi', '养子', { temple: '少帝', year: -188, status: 'disputed', note: '惠帝后宫子，吕后立而旋废杀；史书或列入本纪，或视为吕后临朝。' }),
          n('xihan-houshaodi', '后少帝', '刘弘', '前184—前180', 'xihan-huidi', '养子', { temple: '少帝', year: -184, status: 'disputed', note: '吕后所立，诸吕之乱后被废；正统性有争议。' }),
          n('xihan-wendi', '汉文帝', '刘恒', '前180—前157', 'xihan-gaozu', '子', { temple: '太宗孝文皇帝', year: -180, era: '文帝', note: '代王入继；轻徭薄赋、与民休息，与景帝并称“文景之治”。' }),
          n('xihan-jingdi', '汉景帝', '刘启', '前157—前141', 'xihan-wendi', '子', { temple: '孝景皇帝', year: -157, era: '景帝', note: '平七国之乱，收诸侯王支郡；继续削藩与休养。' }),
          n('xihan-wudi', '汉武帝', '刘彻', '前141—前87', 'xihan-jingdi', '子', { temple: '世宗孝武皇帝', year: -141, era: '建元—后元', note: '罢黜百家、独尊儒术；北击匈奴、通西域、盐铁官营，晚年下轮台诏。' }),
          n('xihan-zhaodi', '汉昭帝', '刘弗陵', '前87—前74', 'xihan-wudi', '子', { temple: '孝昭皇帝', year: -87, era: '始元—元平', note: '八岁即位，霍光辅政；轻徭薄赋，与民休息。' }),
          n('xihan-xuandi', '汉宣帝', '刘询', '前74—前49', 'xihan-wudi', '曾孙', { temple: '中宗孝宣皇帝', year: -74, era: '本始—黄龙', note: '戾太子刘据之孙，流落民间后入继；吏治清明，史称“孝宣之治”。' }),
          n('xihan-yuandi', '汉元帝', '刘奭', '前49—前33', 'xihan-xuandi', '子', { temple: '孝元皇帝', year: -49, era: '初元—竟宁', note: '柔仁好儒，宦官弘恭、石显用事；西汉由盛转衰。' }),
          n('xihan-chengdi', '汉成帝', '刘骜', '前33—前7', 'xihan-yuandi', '子', { temple: '孝成皇帝', year: -33, era: '建始—绥和', note: '外戚王氏崛起，王莽任大司马；赵飞燕姐妹入宫。' }),
          n('xihan-aidi', '汉哀帝', '刘欣', '前7—前1', 'xihan-yuandi', '孙', { temple: '孝哀皇帝', year: -7, era: '建平—元寿', note: '定陶王刘康之子，入继大统；宠董贤，外戚丁、傅用事。' }),
          n('xihan-pingdi', '汉平帝', '刘衎', '前1—5', 'xihan-yuandi', '孙', { temple: '孝平皇帝', year: 1, era: '元始', note: '中山王刘兴之子，九岁即位，王莽辅政；相传为王莽所鸩。' }),
          n('xihan-ruzi', '孺子婴', '刘婴', '6—8', 'xihan-xuandi', '玄孙', { temple: '孺子', year: 6, status: 'disputed', note: '宣帝玄孙，王莽立为皇太子，号“孺子”；王莽摄政，后篡汉。' }),
        ]),
      ]),
      d('donghan', '东汉', '25—220', '光武中兴至献帝禅魏。外戚与宦官交替专权；和帝以后多幼主即位，皇统频繁转入旁支。', [
        h('donghan-house', '刘氏汉室', '光武至献帝。', [
          n('donghan-guangwu', '汉光武帝', '刘秀', '25—57', null, '开国', { temple: '世祖光武皇帝', year: 25, era: '建武—中元', note: '昆阳之战后崛起，25年称帝，定都洛阳；削平群雄，史称“光武中兴”。' }),
          n('donghan-mingdi', '汉明帝', '刘庄', '57—75', 'donghan-guangwu', '子', { temple: '显宗孝明皇帝', year: 57, era: '永平', note: '明章之治；遣班超通西域，佛教东传。' }),
          n('donghan-zhangdi', '汉章帝', '刘炟', '75—88', 'donghan-mingdi', '子', { temple: '肃宗孝章皇帝', year: 75, era: '建初—章和', note: '与明帝并称“明章之治”；白虎观会议定五经异同。' }),
          n('donghan-hedi', '汉和帝', '刘肇', '88—106', 'donghan-zhangdi', '子', { temple: '穆宗孝和皇帝', year: 88, era: '永元—元兴', note: '十岁即位，窦太后临朝；后诛窦宪，宦官郑众用事。' }),
          n('donghan-shangdi', '汉殇帝', '刘隆', '106', 'donghan-hedi', '子', { temple: '孝殇皇帝', year: 106, era: '延平', note: '出生百余日即位，在位八个月而夭。' }),
          n('donghan-andi', '汉安帝', '刘祜', '106—125', 'donghan-zhangdi', '孙', { temple: '恭宗孝安皇帝', year: 106, era: '永初—延光', note: '清河王刘庆之子；邓太后临朝，后宦官李闰等用事。' }),
          n('donghan-shundi', '汉顺帝', '刘保', '125—144', 'donghan-andi', '子', { temple: '敬宗孝顺皇帝', year: 125, era: '永建—汉安', note: '宦官拥立；外戚梁商、梁冀相继掌权。' }),
          n('donghan-chongdi', '汉冲帝', '刘炳', '144—145', 'donghan-shundi', '子', { temple: '孝冲皇帝', year: 144, era: '永嘉', note: '两岁即位，在位半年而夭。' }),
          n('donghan-zhidi', '汉质帝', '刘缵', '145—146', 'donghan-zhangdi', '玄孙', { temple: '孝质皇帝', year: 145, era: '本初', note: '八岁即位，因称梁冀“跋扈将军”被鸩杀。' }),
          n('donghan-huandi', '汉桓帝', '刘志', '146—168', 'donghan-zhangdi', '曾孙', { temple: '威宗孝桓皇帝', year: 146, era: '建和—永康', note: '蠡吾侯刘翼之子；诛梁冀后宦官专权，党锢之祸起。' }),
          n('donghan-lingdi', '汉灵帝', '刘宏', '168—189', 'donghan-zhangdi', '玄孙', { temple: '孝灵皇帝', year: 168, era: '建宁—中平', note: '解渎亭侯刘苌之子；卖官鬻爵，黄巾起义爆发。' }),
          n('donghan-shaodi', '汉少帝', '刘辩', '189', 'donghan-lingdi', '子', { temple: '少帝', year: 189, era: '光熹—昭宁', note: '何太后所生，即位不久被董卓废为弘农王。' }),
          n('donghan-xiandi', '汉献帝', '刘协', '189—220', 'donghan-lingdi', '子', { temple: '孝献皇帝', year: 189, era: '初平—建安', note: '董卓所立，后为曹操挟天子以令诸侯；220年禅魏。' }),
        ]),
      ]),
      d('sanguo', '三国', '220—280', '魏、蜀、吴三分天下。曹魏承汉禅，蜀汉自居汉室正统，孙吴据江东；三国君主世系各自成树。', [
        h('wei-house', '曹魏', '曹操追尊武帝，曹丕受禅。', [
          n('wei-caocao', '曹操', '曹操', '追尊', null, '追尊', { temple: '魏武帝（追尊）', year: 220, status: 'honored', note: '东汉丞相、魏王，奠定曹魏基业；生前未称帝，曹丕追尊。' }),
          n('wei-wendi', '魏文帝', '曹丕', '220—226', 'wei-caocao', '子', { temple: '高祖文皇帝', year: 220, era: '黄初', note: '受汉禅称帝，定都洛阳；行九品中正制。' }),
          n('wei-mingdi', '魏明帝', '曹叡', '226—239', 'wei-wendi', '子', { temple: '烈祖明皇帝', year: 226, era: '太和—景初', note: '诸葛亮北伐的主要对手；晚年大兴土木。' }),
          n('wei-qiwang', '魏齐王', '曹芳', '239—254', 'wei-mingdi', '养子', { temple: '齐王', year: 239, era: '正始—嘉平', note: '曹楷之子，明帝养子；高平陵之变后司马氏专权，被废。' }),
          n('wei-guigui', '魏高贵乡公', '曹髦', '254—260', 'wei-caocao', '孙', { temple: '高贵乡公', year: 254, era: '正元—甘露', note: '曹霖之子；不甘为傀儡，率僮仆讨司马昭，被杀。' }),
          n('wei-yuandi', '魏元帝', '曹奂', '260—266', 'wei-caocao', '孙', { temple: '元皇帝', year: 260, era: '景元—咸熙', note: '曹宇之子；265年司马炎代魏，降为陈留王。' }),
        ]),
        h('shu-house', '蜀汉', '刘备称帝，托孤诸葛亮。', [
          n('shu-zhaolie', '汉昭烈帝', '刘备', '221—223', null, '开国', { temple: '烈祖昭烈皇帝', year: 221, era: '章武', note: '221年称帝于成都，国号汉；夷陵之战败于陆逊，托孤白帝城。' }),
          n('shu-houzhu', '蜀后主', '刘禅', '223—263', 'shu-zhaolie', '子', { temple: '后主', year: 223, era: '建兴—炎兴', note: '诸葛亮辅政；263年魏灭蜀，降魏，乐不思蜀。' }),
        ]),
        h('wu-house', '孙吴', '孙坚、孙策追尊，孙权称帝。', [
          n('wu-sunjian', '孙坚', '孙坚', '追尊', null, '追尊', { temple: '吴武烈帝（追尊）', year: 229, status: 'honored', note: '孙吴基业开创者；讨董卓时战死，孙权追尊。' }),
          n('wu-sunce', '孙策', '孙策', '追尊', null, '追尊', { temple: '长沙桓王（追尊）', year: 229, status: 'honored', note: '孙坚长子，平定江东；遇刺身亡，孙权追封桓王。' }),
          n('wu-dadi', '吴大帝', '孙权', '229—252', 'wu-sunjian', '子', { temple: '太祖大皇帝', year: 229, era: '黄龙—神凤', note: '229年称帝，定都建业；晚年猜忌，二宫之争。' }),
          n('wu-kuaiji', '吴会稽王', '孙亮', '252—258', 'wu-dadi', '子', { temple: '会稽王', year: 252, era: '建兴—太平', note: '十岁即位，诸葛恪辅政；后被孙綝废黜。' }),
          n('wu-jingdi', '吴景帝', '孙休', '258—264', 'wu-dadi', '子', { temple: '景皇帝', year: 258, era: '永安', note: '诛孙綝亲政；在位期间整理典籍。' }),
          n('wu-modi', '吴末帝', '孙皓', '264—280', 'wu-dadi', '孙', { temple: '末帝', year: 264, era: '元兴—天纪', note: '孙和之子；暴虐失人心，280年晋灭吴。' }),
        ]),
      ]),
      d('xijin', '西晋', '266—316', '司马氏代魏，短暂统一。八王之乱与永嘉之乱后，北方沦陷，晋室南渡。', [
        h('xijin-house', '司马氏晋室', '司马懿至愍帝。', [
          n('xijin-simayi', '司马懿', '司马懿', '追尊', null, '追尊', { temple: '晋宣帝（追尊）', year: 266, status: 'honored', note: '曹魏重臣，高平陵之变后掌权；晋室追尊宣帝。' }),
          n('xijin-simashi', '司马师', '司马师', '追尊', 'xijin-simayi', '子', { temple: '晋景帝（追尊）', year: 266, status: 'honored', note: '司马懿长子，继续专魏政；平定毌丘俭、文钦之乱。' }),
          n('xijin-simazhao', '司马昭', '司马昭', '追尊', 'xijin-simayi', '子', { temple: '晋文帝（追尊）', year: 266, status: 'honored', note: '司马懿次子；灭蜀汉，封晋王，为司马炎代魏铺路。' }),
          n('xijin-wudi', '晋武帝', '司马炎', '266—290', 'xijin-simazhao', '子', { temple: '世祖武皇帝', year: 266, era: '泰始—太熙', note: '266年代魏，280年灭吴统一；大封宗室，埋下八王之乱。' }),
          n('xijin-huidi', '晋惠帝', '司马衷', '290—307', 'xijin-wudi', '子', { temple: '孝惠皇帝', year: 290, era: '永熙—光熙', note: '“何不食肉糜”；贾后干政，八王之乱爆发。' }),
          n('xijin-huaidi', '晋怀帝', '司马炽', '307—311', 'xijin-wudi', '子', { temple: '孝怀皇帝', year: 307, era: '永嘉', note: '永嘉之乱中被匈奴刘曜俘至平阳，西晋名存实亡。' }),
          n('xijin-mindi', '晋愍帝', '司马邺', '313—316', 'xijin-wudi', '孙', { temple: '孝愍皇帝', year: 313, era: '建兴', note: '吴王司马晏之子；长安陷落，西晋亡。' }),
        ]),
      ]),
      d('dongjin', '东晋', '317—420', '司马睿南渡建康，与门阀共天下。皇权衰弱，北伐与内乱交替；420年禅于刘裕。', [
        h('dongjin-house', '司马氏晋室', '元帝至恭帝。', [
          n('dongjin-yuandi', '晋元帝', '司马睿', '317—323', null, '开国', { temple: '中宗元皇帝', year: 317, era: '建武—永昌', note: '司马懿曾孙；南渡后称晋王，317年称帝，倚重王导、王敦。' }),
          n('dongjin-mingdi', '晋明帝', '司马绍', '323—325', 'dongjin-yuandi', '子', { temple: '肃宗明皇帝', year: 323, era: '太宁', note: '平定王敦之乱；在位短促。' }),
          n('dongjin-chengdi', '晋成帝', '司马衍', '325—342', 'dongjin-mingdi', '子', { temple: '显宗成皇帝', year: 325, era: '咸和—咸康', note: '幼年即位，庾太后临朝；苏峻之乱后重建建康。' }),
          n('dongjin-kangdi', '晋康帝', '司马岳', '342—344', 'dongjin-yuandi', '子', { temple: '康皇帝', year: 342, era: '建元', note: '明帝同母弟；在位两年。' }),
          n('dongjin-mudi', '晋穆帝', '司马聃', '344—361', 'dongjin-kangdi', '子', { temple: '孝宗穆皇帝', year: 344, era: '永和—升平', note: '两岁即位，褚太后临朝；桓温灭成汉、北伐。' }),
          n('dongjin-aidi', '晋哀帝', '司马丕', '361—365', 'dongjin-chengdi', '子', { temple: '哀皇帝', year: 361, era: '隆和—兴宁', note: '成帝长子；好黄老，不亲政事。' }),
          n('dongjin-feidi', '晋废帝', '司马奕', '365—371', 'dongjin-chengdi', '子', { temple: '海西公', year: 365, era: '太和', note: '成帝子；桓温北伐失利后废为海西公。' }),
          n('dongjin-jianwen', '晋简文帝', '司马昱', '371—372', 'dongjin-yuandi', '子', { temple: '太宗简文皇帝', year: 371, era: '咸安', note: '元帝少子；桓温所立，在位仅八个月。' }),
          n('dongjin-xiaowu', '晋孝武帝', '司马曜', '372—396', 'dongjin-jianwen', '子', { temple: '烈宗孝武皇帝', year: 372, era: '宁康—太元', note: '淝水之战时在位；后期沉湎酒色，为张贵人所弑。' }),
          n('dongjin-andi', '晋安帝', '司马德宗', '396—418', 'dongjin-xiaowu', '子', { temple: '安皇帝', year: 396, era: '隆安—义熙', note: '白痴皇帝；桓玄篡晋、刘裕崛起皆在其朝。' }),
          n('dongjin-gongdi', '晋恭帝', '司马德文', '418—420', 'dongjin-xiaowu', '子', { temple: '恭皇帝', year: 418, era: '元熙', note: '安帝弟；420年禅位于刘裕，东晋亡。' }),
        ]),
      ]),
      d('nanbei', '南北朝', '420—589', '南朝宋、齐、梁、陈与北朝魏、齐、周对峙。皇统频繁在兄弟、侄子与养子之间转移，是理解“皇位继承”最好的切片。', [
        h('song-house', '南朝宋', '刘裕至顺帝。', [
          n('song-wudi', '宋武帝', '刘裕', '420—422', null, '开国', { temple: '高祖武皇帝', year: 420, era: '永初', note: '寒门出身，北伐灭南燕、后秦；420年代晋建宋。' }),
          n('song-shaodi', '宋少帝', '刘义符', '422—424', 'song-wudi', '子', { temple: '少帝', year: 422, era: '景平', note: '游戏无度，被徐羡之等废杀。' }),
          n('song-wendi', '宋文帝', '刘义隆', '424—453', 'song-wudi', '子', { temple: '太祖文皇帝', year: 424, era: '元嘉', note: '元嘉之治；三次北伐失败，被太子刘劭所弑。' }),
          n('song-xiaowu', '宋孝武帝', '刘骏', '453—464', 'song-wendi', '子', { temple: '世祖孝武皇帝', year: 453, era: '孝建—大明', note: '平定刘劭之乱后即位；加强皇权，抑制宗室。' }),
          n('song-qianfei', '宋前废帝', '刘子业', '464—465', 'song-xiaowu', '子', { temple: '前废帝', year: 464, era: '永光—景和', note: '荒淫暴虐，被湘东王刘彧等弑杀。' }),
          n('song-mingdi', '宋明帝', '刘彧', '465—472', 'song-wendi', '子', { temple: '太宗明皇帝', year: 465, era: '泰始—泰豫', note: '文帝之子；平定宗室反抗，但北魏趁机夺取淮北。' }),
          n('song-houfei', '宋后废帝', '刘昱', '472—477', 'song-mingdi', '子', { temple: '后废帝', year: 472, era: '元徽', note: '暴虐无道，被萧道成弑杀。' }),
          n('song-shundi', '宋顺帝', '刘准', '477—479', 'song-mingdi', '子', { temple: '顺皇帝', year: 477, era: '升明', note: '九岁即位，479年禅位于萧道成。' }),
        ]),
        h('qi-house', '南朝齐', '萧道成至和帝。', [
          n('qi-gaodi', '齐高帝', '萧道成', '479—482', null, '开国', { temple: '太祖高皇帝', year: 479, era: '建元', note: '代宋建齐；提倡节俭。' }),
          n('qi-wudi', '齐武帝', '萧赜', '482—493', 'qi-gaodi', '子', { temple: '世祖武皇帝', year: 482, era: '永明', note: '永明之治；与北魏通好，文化兴盛。' }),
          n('qi-yulin', '郁林王', '萧昭业', '493—494', 'qi-wudi', '孙', { temple: '郁林王', year: 493, era: '隆昌', note: '萧长懋之子；被萧鸾废杀。' }),
          n('qi-hailing', '海陵王', '萧昭文', '494', 'qi-wudi', '孙', { temple: '海陵王', year: 494, era: '延兴', note: '萧昭业之弟；在位数月，被萧鸾废杀。' }),
          n('qi-mingdi', '齐明帝', '萧鸾', '494—498', 'qi-gaodi', '侄', { temple: '高宗明皇帝', year: 494, era: '建武—永泰', note: '齐高帝侄；大杀宗室，在位期间北魏孝文帝南征。' }),
          n('qi-donghun', '东昏侯', '萧宝卷', '498—501', 'qi-mingdi', '子', { temple: '东昏侯', year: 498, era: '永元', note: '荒淫残暴，被萧衍起兵推翻。' }),
          n('qi-hedi', '齐和帝', '萧宝融', '501—502', 'qi-mingdi', '子', { temple: '和皇帝', year: 501, era: '中兴', note: '萧衍所立，次年禅位于梁。' }),
        ]),
        h('liang-house', '南朝梁', '萧衍至敬帝。', [
          n('liang-wudi', '梁武帝', '萧衍', '502—549', null, '开国', { temple: '高祖武皇帝', year: 502, era: '天监—太清', note: '在位四十八年，崇佛；侯景之乱中饿死台城。' }),
          n('liang-jianwen', '梁简文帝', '萧纲', '549—551', 'liang-wudi', '子', { temple: '太宗简文皇帝', year: 549, era: '大宝', note: '侯景所立，后被废杀；宫体诗代表。' }),
          n('liang-yuandi', '梁元帝', '萧绎', '552—555', 'liang-wudi', '子', { temple: '世祖元皇帝', year: 552, era: '承圣', note: '平定侯景后在江陵即位；西魏破江陵，焚书十四万卷。' }),
          n('liang-jingdi', '梁敬帝', '萧方智', '555—557', 'liang-yuandi', '子', { temple: '敬皇帝', year: 555, era: '绍泰—太平', note: '陈霸先所立，557年禅陈。' }),
        ]),
        h('chen-house', '南朝陈', '陈霸先至后主。', [
          n('chen-wudi', '陈武帝', '陈霸先', '557—559', null, '开国', { temple: '高祖武皇帝', year: 557, era: '永定', note: '寒门出身，平定侯景之乱；557年代梁建陈。' }),
          n('chen-wendi', '陈文帝', '陈蒨', '559—566', 'chen-wudi', '侄', { temple: '世祖文皇帝', year: 559, era: '天嘉—天康', note: '陈霸先侄；平定王琳，江南稍安。' }),
          n('chen-feidi', '陈废帝', '陈伯宗', '566—568', 'chen-wendi', '子', { temple: '废帝', year: 566, era: '光大', note: '年幼即位，被叔父陈顼废黜。' }),
          n('chen-xuandi', '陈宣帝', '陈顼', '568—582', 'chen-wudi', '侄', { temple: '高宗宣皇帝', year: 568, era: '太建', note: '文帝弟；北伐一度收复淮南，后为北周所败。' }),
          n('chen-houzhu', '陈后主', '陈叔宝', '582—589', 'chen-xuandi', '子', { temple: '后主', year: 582, era: '至德—祯明', note: '荒于酒色，《玉树后庭花》；589年隋灭陈。' }),
        ]),
        h('beiwei-house', '北朝魏（含东魏、西魏）', '道武帝至孝武帝，附东魏孝静帝、西魏文帝。', [
          n('beiwei-daowu', '道武帝', '拓跋珪', '386—409', null, '开国', { temple: '太祖道武皇帝', year: 386, era: '登国—天赐', note: '重建代国，改国号魏；迁都平城，奠定北魏。' }),
          n('beiwei-mingyuan', '明元帝', '拓跋嗣', '409—423', 'beiwei-daowu', '子', { temple: '太宗明元皇帝', year: 409, era: '永兴—神瑞', note: '继续经略北方；晚年服食丹药。' }),
          n('beiwei-taiwu', '太武帝', '拓跋焘', '423—452', 'beiwei-mingyuan', '子', { temple: '世祖太武皇帝', year: 423, era: '始光—正平', note: '统一北方，灭北凉、北燕；太武灭佛。' }),
          n('beiwei-wencheng', '文成帝', '拓跋濬', '452—465', 'beiwei-taiwu', '孙', { temple: '高宗文成皇帝', year: 452, era: '兴安—和平', note: '拓跋晃之子；复兴佛教，开凿云冈石窟。' }),
          n('beiwei-xianwen', '献文帝', '拓跋弘', '465—471', 'beiwei-wencheng', '子', { temple: '显祖献文皇帝', year: 465, era: '天安—皇兴', note: '禅位幼子孝文帝，自为太上皇；后被冯太后毒死。' }),
          n('beiwei-xiaowen', '孝文帝', '元宏', '471—499', 'beiwei-xianwen', '子', { temple: '高祖孝文皇帝', year: 471, era: '延兴—太和', note: '迁都洛阳，改汉姓、易服色，推行汉化改革。' }),
          n('beiwei-xuanwu', '宣武帝', '元恪', '499—515', 'beiwei-xiaowen', '子', { temple: '世宗宣武皇帝', year: 499, era: '景明—延昌', note: '北魏由盛转衰；佛教盛行，龙门石窟继续开凿。' }),
          n('beiwei-xiaoming', '孝明帝', '元诩', '515—528', 'beiwei-xuanwu', '子', { temple: '肃宗孝明皇帝', year: 515, era: '熙平—武泰', note: '年幼即位，胡太后临朝；被胡太后毒死，引发河阴之变。' }),
          n('beiwei-xiaozhuang', '孝庄帝', '元子攸', '528—530', 'beiwei-xianwen', '孙', { temple: '敬宗孝庄皇帝', year: 528, era: '建义—永安', note: '元勰之子；诛尔朱荣，后被尔朱兆所杀。' }),
          n('beiwei-jiemin', '节闵帝', '元恭', '531—532', 'beiwei-xianwen', '孙', { temple: '节闵皇帝', year: 531, era: '普泰', note: '元羽之子；尔朱氏所立，高欢入洛后废。' }),
          n('beiwei-xiaowu', '孝武帝', '元修', '532—535', 'beiwei-xiaowen', '孙', { temple: '孝武皇帝', year: 532, era: '太昌—永熙', note: '元怀之子；与高欢决裂，西奔关中投宇文泰。' }),
          n('dongwei-xiaojing', '东魏孝静帝', '元善见', '534—550', 'beiwei-xiaowen', '曾孙', { temple: '孝静皇帝', year: 534, era: '天平—武定', note: '高欢所立，迁都邺；550年禅北齐。' }),
          n('xiwei-wendi', '西魏文帝', '元宝炬', '535—551', 'beiwei-xiaowen', '孙', { temple: '文皇帝', year: 535, era: '大统', note: '宇文泰所立，都长安；西魏实权在宇文氏。' }),
        ]),
        h('beiqi-house', '北朝齐', '高欢追尊，高洋建齐。', [
          n('beiqi-shenwu', '高欢', '高欢', '追尊', null, '追尊', { temple: '齐神武帝（追尊）', year: 550, status: 'honored', note: '东魏权臣，北齐基业奠基者；高洋追尊神武帝。' }),
          n('beiqi-wenxiang', '高澄', '高澄', '追尊', 'beiqi-shenwu', '子', { temple: '齐文襄帝（追尊）', year: 550, status: 'honored', note: '高欢长子；遇刺身亡，北齐建立后追尊。' }),
          n('beiqi-wenxuan', '文宣帝', '高洋', '550—559', 'beiqi-shenwu', '子', { temple: '显祖文宣皇帝', year: 550, era: '天保', note: '代东魏建北齐；前期英武，后期酗酒暴虐。' }),
          n('beiqi-fei', '废帝', '高殷', '559—560', 'beiqi-wenxuan', '子', { temple: '废帝', year: 559, era: '乾明', note: '高洋之子；被叔父高演废杀。' }),
          n('beiqi-xiaozhao', '孝昭帝', '高演', '560—561', 'beiqi-shenwu', '子', { temple: '肃宗孝昭皇帝', year: 560, era: '皇建', note: '高欢第六子；政变夺位，在位一年余。' }),
          n('beiqi-wucheng', '武成帝', '高湛', '561—565', 'beiqi-shenwu', '子', { temple: '世祖武成皇帝', year: 561, era: '太宁—河清', note: '高欢第九子；禅位高纬，自为太上皇。' }),
          n('beiqi-houzhu', '后主', '高纬', '565—577', 'beiqi-wucheng', '子', { temple: '后主', year: 565, era: '天统—隆化', note: '荒淫无道，杀斛律光；577年为北周所灭。' }),
          n('beiqi-youzhu', '幼主', '高恒', '577', 'beiqi-houzhu', '子', { temple: '幼主', year: 577, era: '承光', note: '八岁即位，北周破邺，北齐亡。' }),
        ]),
        h('beizhou-house', '北朝周', '宇文泰追尊，宇文觉建周。', [
          n('beizhou-taizu', '宇文泰', '宇文泰', '追尊', null, '追尊', { temple: '周文帝（追尊）', year: 557, status: 'honored', note: '西魏权臣，创府兵制；宇文觉追尊文帝。' }),
          n('beizhou-xiaomin', '孝闵帝', '宇文觉', '557', 'beizhou-taizu', '子', { temple: '孝闵皇帝', year: 557, era: '元年', note: '代西魏建周，年幼，被宇文护废杀。' }),
          n('beizhou-mingdi', '明帝', '宇文毓', '557—560', 'beizhou-taizu', '子', { temple: '世宗明皇帝', year: 557, era: '元年—武成', note: '宇文泰庶长子；被宇文护毒死。' }),
          n('beizhou-wudi', '武帝', '宇文邕', '560—578', 'beizhou-taizu', '子', { temple: '高祖武皇帝', year: 560, era: '保定—宣政', note: '诛宇文护亲政；灭北齐，统一北方；建德毁佛。' }),
          n('beizhou-xuandi', '宣帝', '宇文赟', '578—579', 'beizhou-wudi', '子', { temple: '宣皇帝', year: 578, era: '大成', note: '荒淫短命；禅位幼子宇文阐，自为太上皇。' }),
          n('beizhou-jingdi', '静帝', '宇文阐', '579—581', 'beizhou-xuandi', '子', { temple: '静皇帝', year: 579, era: '大象—大定', note: '幼年即位，581年禅位于杨坚，北周亡。' }),
        ]),
      ]),
      d('sui', '隋', '581—618', '杨坚代周建隋，589年灭陈统一。炀帝大兴土木、三征高句丽，天下大乱；618年亡。', [
        h('sui-house', '杨氏隋室', '杨忠追尊，文帝至恭帝。', [
          n('sui-taizu', '杨忠', '杨忠', '追尊', null, '追尊', { temple: '隋太祖（追尊）', year: 581, status: 'honored', note: '西魏、北周名将，杨坚之父；隋建立后追尊太祖。' }),
          n('sui-wendi', '隋文帝', '杨坚', '581—604', 'sui-taizu', '子', { temple: '高祖文皇帝', year: 581, era: '开皇—仁寿', note: '代周建隋，589年灭陈；创三省六部、科举，开皇之治。' }),
          n('sui-yangdi', '隋炀帝', '杨广', '604—618', 'sui-wendi', '子', { temple: '炀皇帝', year: 604, era: '大业', note: '开大运河、迁都洛阳、三征高句丽；江都之变中被弑。' }),
          n('sui-gongdi', '隋恭帝', '杨侑', '617—618', 'sui-yangdi', '孙', { temple: '恭皇帝', year: 617, era: '义宁', note: '杨昭之子；李渊所立，618年禅唐。' }),
        ]),
      ]),
      d('tang', '唐', '618—907', '李渊建唐，太宗贞观之治、玄宗开元盛世，安史之乱后藩镇割据；907年朱温代唐。', [
        h('tang-house', '李氏唐室', '李虎追尊，高祖至哀帝；武周附于高宗之后。', [
          n('tang-taizu', '李虎', '李虎', '追尊', null, '追尊', { temple: '唐太祖（追尊）', year: 618, status: 'honored', note: '西魏八柱国之一，李渊祖父；唐建立后追尊太祖。' }),
          n('tang-shizu', '李昞', '李昞', '追尊', 'tang-taizu', '子', { temple: '唐世祖（追尊）', year: 618, status: 'honored', note: '李虎之子，李渊之父；追尊世祖。' }),
          n('tang-gaozu', '唐高祖', '李渊', '618—626', 'tang-shizu', '子', { temple: '高祖神尧皇帝', year: 618, era: '武德', note: '太原起兵，618年称帝；玄武门之变后禅位李世民。' }),
          n('tang-taizong', '唐太宗', '李世民', '626—649', 'tang-gaozu', '子', { temple: '太宗文皇帝', year: 626, era: '贞观', note: '玄武门之变后即位；贞观之治，被尊为“天可汗”。' }),
          n('tang-gaozong', '唐高宗', '李治', '649—683', 'tang-taizong', '子', { temple: '高宗天皇大帝', year: 649, era: '永徽—弘道', note: '灭西突厥、高句丽；晚年武则天参预朝政。' }),
          n('tang-zhongzong', '唐中宗', '李显', '684；705—710', 'tang-gaozong', '子', { temple: '中宗', year: 705, era: '嗣圣—景龙', note: '两度即位；复位后韦后干政，被韦后与安乐公主毒死。' }),
          n('tang-ruizong', '唐睿宗', '李旦', '684—690；710—712', 'tang-gaozong', '子', { temple: '睿宗', year: 710, era: '文明—延和', note: '两度即位；第二次复位后禅位李隆基。' }),
          n('tang-wuzetian', '武则天', '武曌', '690—705', 'tang-gaozong', '皇后称帝', { temple: '则天大圣皇帝', year: 690, era: '天授—神龙', status: 'disputed', note: '高宗皇后，690年改唐为周，称圣神皇帝；中国唯一女皇帝。' }),
          n('tang-xuanzong', '唐玄宗', '李隆基', '712—756', 'tang-ruizong', '子', { temple: '玄宗明皇帝', year: 712, era: '先天—天宝', note: '开元盛世；晚年宠杨贵妃、任李林甫，安史之乱爆发。' }),
          n('tang-suzong', '唐肃宗', '李亨', '756—762', 'tang-xuanzong', '子', { temple: '肃宗', year: 756, era: '至德—宝应', note: '灵武即位，平定安史之乱；宦官李辅国专权。' }),
          n('tang-daizong', '唐代宗', '李豫', '762—779', 'tang-suzong', '子', { temple: '代宗', year: 762, era: '宝应—大历', note: '安史之乱平定；藩镇割据成形，吐蕃一度攻入长安。' }),
          n('tang-dezong', '唐德宗', '李适', '779—805', 'tang-daizong', '子', { temple: '德宗', year: 779, era: '建中—贞元', note: '削藩引发泾原兵变；后行两税法。' }),
          n('tang-shunzong', '唐顺宗', '李诵', '805', 'tang-dezong', '子', { temple: '顺宗', year: 805, era: '永贞', note: '在位仅数月，永贞革新失败，被迫禅位。' }),
          n('tang-xianzong', '唐宪宗', '李纯', '805—820', 'tang-shunzong', '子', { temple: '宪宗', year: 805, era: '元和', note: '元和中兴，削平淮西等藩镇；晚年服丹暴卒。' }),
          n('tang-muzong', '唐穆宗', '李恒', '820—824', 'tang-xianzong', '子', { temple: '穆宗', year: 820, era: '长庆', note: '河朔三镇复叛；在位四年。' }),
          n('tang-jingzong', '唐敬宗', '李湛', '824—826', 'tang-muzong', '子', { temple: '敬宗', year: 824, era: '宝历', note: '游戏无度，被宦官所弑。' }),
          n('tang-wenzong', '唐文宗', '李昂', '826—840', 'tang-muzong', '子', { temple: '文宗', year: 826, era: '太和—开成', note: '甘露之变谋诛宦官失败，此后受制于家奴。' }),
          n('tang-wuzong', '唐武宗', '李炎', '840—846', 'tang-muzong', '子', { temple: '武宗', year: 840, era: '会昌', note: '会昌灭佛；击败回鹘，藩镇稍安。' }),
          n('tang-xuanzong2', '唐宣宗', '李忱', '846—859', 'tang-xianzong', '子', { temple: '宣宗', year: 846, era: '大中', note: '“小太宗”；收复河湟，抑制宦官。' }),
          n('tang-yizong', '唐懿宗', '李漼', '859—873', 'tang-xuanzong2', '子', { temple: '懿宗', year: 859, era: '咸通', note: '沉湎游乐；裘甫、庞勋起义。' }),
          n('tang-xizong', '唐僖宗', '李儇', '873—888', 'tang-yizong', '子', { temple: '僖宗', year: 873, era: '乾符—文德', note: '黄巢起义攻入长安，僖宗奔蜀。' }),
          n('tang-zhaozong', '唐昭宗', '李晔', '888—904', 'tang-yizong', '子', { temple: '昭宗', year: 888, era: '龙纪—天祐', note: '力图复兴，受制于朱温；被朱温弑杀。' }),
          n('tang-aidi', '唐哀帝', '李柷', '904—907', 'tang-zhaozong', '子', { temple: '哀皇帝', year: 904, era: '天祐', note: '朱温所立，907年禅位，唐亡。' }),
        ]),
      ]),
      d('wudai', '五代十国', '907—960', '后梁、后唐、后晋、后汉、后周相继占据中原，十国割据南方。武人政治，皇位继承极不稳定。', [
        h('houliang-house', '后梁', '朱温至朱友贞。', [
          n('liang-taizu', '后梁太祖', '朱温', '907—912', null, '开国', { temple: '太祖', year: 907, era: '开平—乾化', note: '黄巢旧部，降唐后据中原；907年代唐建梁。' }),
          n('liang-yingwang', '朱友珪', '朱友珪', '912—913', 'liang-taizu', '子', { temple: '郢王', year: 912, era: '凤历', note: '弑父自立，次年被朱友贞所杀。' }),
          n('liang-modi', '后梁末帝', '朱友贞', '913—923', 'liang-taizu', '子', { temple: '末帝', year: 913, era: '乾化—龙德', note: '与后唐争战，923年开封陷落，后梁亡。' }),
        ]),
        h('houtang-house', '后唐', '李克用追尊，李存勖建唐。', [
          n('tang-li-keyong', '李克用', '李克用', '追尊', null, '追尊', { temple: '后唐太祖（追尊）', year: 923, status: 'honored', note: '沙陀军阀，据河东；李存勖追尊太祖。' }),
          n('tang-zhuangzong', '后唐庄宗', '李存勖', '923—926', 'tang-li-keyong', '子', { temple: '庄宗', year: 923, era: '同光', note: '灭后梁建后唐；宠信伶人，兴教门之变中被杀。' }),
          n('tang-mingzong', '后唐明宗', '李嗣源', '926—933', 'tang-li-keyong', '养子', { temple: '明宗', year: 926, era: '天成—长兴', note: '李克用养子；革除庄宗弊政，史称小康。' }),
          n('tang-mindi', '后唐闵帝', '李从厚', '933—934', 'tang-mingzong', '子', { temple: '闵帝', year: 933, era: '应顺', note: '即位后削藩，被李从珂推翻。' }),
          n('tang-modi', '后唐末帝', '李从珂', '934—936', 'tang-mingzong', '养子', { temple: '末帝', year: 934, era: '清泰', note: '明宗养子；石敬瑭引契丹南下，自焚而死。' }),
        ]),
        h('houjin-house', '后晋', '石敬瑭至石重贵。', [
          n('jin-gaozu', '后晋高祖', '石敬瑭', '936—942', null, '开国', { temple: '高祖', year: 936, era: '天福', note: '割燕云十六州、称契丹“儿皇帝”，借兵灭后唐。' }),
          n('jin-chudi', '后晋出帝', '石重贵', '942—947', 'jin-gaozu', '侄', { temple: '出帝', year: 942, era: '天福—开运', note: '石敬瑭侄；对契丹称孙不称臣，契丹南下灭晋。' }),
        ]),
        h('houhan-house', '后汉', '刘知远至刘承祐。', [
          n('han-gaozu', '后汉高祖', '刘知远', '947—948', null, '开国', { temple: '高祖', year: 947, era: '天福—乾祐', note: '契丹灭晋后称帝，建立后汉；在位不足一年。' }),
          n('han-yindi', '后汉隐帝', '刘承祐', '948—950', 'han-gaozu', '子', { temple: '隐帝', year: 948, era: '乾祐', note: '猜忌功臣，杀郭威家属；郭威起兵，后汉亡。' }),
        ]),
        h('houzhou-house', '后周', '郭威至柴宗训。', [
          n('zhou-taizu', '后周太祖', '郭威', '951—954', null, '开国', { temple: '太祖', year: 951, era: '广顺—显德', note: '后汉枢密使，起兵建周；改革弊政，为北宋统一奠基。' }),
          n('zhou-shizong', '后周世宗', '柴荣', '954—959', 'zhou-taizu', '养子', { temple: '世宗', year: 954, era: '显德', note: '郭威养子；高平之战、三征南唐、北伐辽，英年早逝。' }),
          n('zhou-gongdi', '后周恭帝', '柴宗训', '959—960', 'zhou-shizong', '子', { temple: '恭帝', year: 959, era: '显德', note: '七岁即位；960年陈桥兵变，禅位于赵匡胤。' }),
        ]),
      ]),
      d('beisong', '北宋', '960—1127', '赵匡胤陈桥兵变建宋，结束五代割据。重文抑武、科举大兴；靖康之变中徽、钦二帝被掳，北宋亡。', [
        h('beisong-house', '赵氏宋室', '赵弘殷追尊，太祖至钦宗。', [
          n('song-hongyin', '赵弘殷', '赵弘殷', '追尊', null, '追尊', { temple: '宋宣祖（追尊）', year: 960, status: 'honored', note: '赵匡胤、赵光义之父；北宋建立后追尊宣祖。' }),
          n('song-taizu', '宋太祖', '赵匡胤', '960—976', 'song-hongyin', '子', { temple: '太祖', year: 960, era: '建隆—开宝', note: '陈桥兵变建宋；杯酒释兵权，先南后北。' }),
          n('song-taizong', '宋太宗', '赵光义', '976—997', 'song-hongyin', '子', { temple: '太宗', year: 976, era: '太平兴国—至道', note: '太祖之弟；灭北汉，两次伐辽失败；扩大科举。' }),
          n('song-zhenzong', '宋真宗', '赵恒', '997—1022', 'song-taizong', '子', { temple: '真宗', year: 997, era: '咸平—乾兴', note: '澶渊之盟，宋辽和平；封禅泰山。' }),
          n('song-renzong', '宋仁宗', '赵祯', '1022—1063', 'song-zhenzong', '子', { temple: '仁宗', year: 1022, era: '天圣—嘉祐', note: '庆历新政；西夏崛起，宋夏战争。' }),
          n('song-yingzong', '宋英宗', '赵曙', '1063—1067', 'song-renzong', '养子', { temple: '英宗', year: 1063, era: '治平', note: '濮王赵允让之子，仁宗养子；濮议之争。' }),
          n('song-shenzong', '宋神宗', '赵顼', '1067—1085', 'song-yingzong', '子', { temple: '神宗', year: 1067, era: '熙宁—元丰', note: '支持王安石变法；元丰改制。' }),
          n('song-zhezong', '宋哲宗', '赵煦', '1085—1100', 'song-shenzong', '子', { temple: '哲宗', year: 1085, era: '元祐—元符', note: '高太后垂帘，元祐更化；亲政后绍述新法。' }),
          n('song-huizong', '宋徽宗', '赵佶', '1100—1126', 'song-shenzong', '子', { temple: '徽宗', year: 1100, era: '建中靖国—宣和', note: '书画皇帝；联金灭辽，引金南下，靖康之变被掳。' }),
          n('song-qinzong', '宋钦宗', '赵桓', '1126—1127', 'song-huizong', '子', { temple: '钦宗', year: 1126, era: '靖康', note: '靖康之变中与徽宗同被金人掳往北方，北宋亡。' }),
        ]),
      ]),
      d('nansong', '南宋', '1127—1279', '赵构在临安重建宋室，与金、蒙古对峙。皇位在太祖、太宗两系之间转移；1279年崖山之战后亡。', [
        h('nansong-house', '赵氏宋室', '高宗至末帝。', [
          n('song-gaozong', '宋高宗', '赵构', '1127—1162', null, '子', { temple: '高宗', year: 1127, era: '建炎—绍兴', parentLabel: '宋徽宗', tag: '徽宗子', note: '徽宗第九子；南渡称帝，定都临安；杀岳飞、与金议和。' }),
          n('song-xiaozong', '宋孝宗', '赵昚', '1162—1189', 'song-gaozong', '养子', { temple: '孝宗', year: 1162, era: '隆兴—淳熙', note: '太祖七世孙，高宗养子；隆兴北伐，乾淳之治。' }),
          n('song-guangzong', '宋光宗', '赵惇', '1189—1194', 'song-xiaozong', '子', { temple: '光宗', year: 1189, era: '绍熙', note: '与父亲孝宗失和；被迫退位。' }),
          n('song-ningzong', '宋宁宗', '赵扩', '1194—1224', 'song-guangzong', '子', { temple: '宁宗', year: 1194, era: '庆元—嘉定', note: '庆元党禁；开禧北伐失败，史弥远专权。' }),
          n('song-lizong', '宋理宗', '赵昀', '1224—1264', 'song-ningzong', '养子', { temple: '理宗', year: 1224, era: '宝庆—景定', note: '太祖十世孙，史弥远所立；联蒙灭金，后蒙古南下。' }),
          n('song-duzong', '宋度宗', '赵禥', '1264—1274', 'song-lizong', '侄', { temple: '度宗', year: 1264, era: '咸淳', note: '理宗侄，智力低下；贾似道专权，襄阳陷落。' }),
          n('song-gongdi', '宋恭帝', '赵㬎', '1274—1276', 'song-duzong', '子', { temple: '恭帝', year: 1274, era: '德祐', note: '四岁即位；1276年临安降元。' }),
          n('song-duanzong', '宋端宗', '赵昰', '1276—1278', 'song-duzong', '子', { temple: '端宗', year: 1276, era: '景炎', note: '临安陷落后在福州即位，流亡海上。' }),
          n('song-bingdi', '宋末帝', '赵昺', '1278—1279', 'song-duzong', '子', { temple: '末帝', year: 1278, era: '祥兴', note: '崖山之战后陆秀夫负帝投海，南宋亡。' }),
        ]),
      ]),
      d('liao', '辽', '916—1125', '契丹耶律氏建立，与北宋、西夏鼎立。皇位在太祖、太宗两系间多次转移；1125年为金所灭。', [
        h('liao-house', '耶律氏契丹', '太祖至天祚帝。', [
          n('liao-taizu', '辽太祖', '耶律阿保机', '916—926', null, '开国', { temple: '太祖', year: 916, era: '神册—天显', note: '统一契丹各部，916年称帝；创契丹文字。' }),
          n('liao-taizong', '辽太宗', '耶律德光', '926—947', 'liao-taizu', '子', { temple: '太宗', year: 926, era: '天显—大同', note: '取燕云十六州，灭后晋；改国号辽。' }),
          n('liao-shizong', '辽世宗', '耶律阮', '947—951', 'liao-taizong', '侄', { temple: '世宗', year: 947, era: '天禄', note: '耶律倍之子；太宗死后被拥立，遇刺身亡。' }),
          n('liao-muzong', '辽穆宗', '耶律璟', '951—969', 'liao-taizong', '子', { temple: '穆宗', year: 951, era: '应历', note: '太宗长子；嗜酒怠政，被近侍所杀。' }),
          n('liao-jingzong', '辽景宗', '耶律贤', '969—982', 'liao-shizong', '子', { temple: '景宗', year: 969, era: '保宁—乾亨', note: '世宗之子；皇后萧绰（萧太后）参预朝政。' }),
          n('liao-shengzong', '辽圣宗', '耶律隆绪', '982—1031', 'liao-jingzong', '子', { temple: '圣宗', year: 982, era: '统和—太平', note: '萧太后摄政；澶渊之盟，辽宋长期和平。' }),
          n('liao-xingzong', '辽兴宗', '耶律宗真', '1031—1055', 'liao-shengzong', '子', { temple: '兴宗', year: 1031, era: '景福—重熙', note: '与西夏交战，迫使宋增岁币。' }),
          n('liao-daozong', '辽道宗', '耶律洪基', '1055—1101', 'liao-xingzong', '子', { temple: '道宗', year: 1055, era: '清宁—寿昌', note: '崇佛；耶律乙辛擅权，皇太子耶律濬被害。' }),
          n('liao-tianzuo', '辽天祚帝', '耶律延禧', '1101—1125', 'liao-daozong', '孙', { temple: '天祚帝', year: 1101, era: '乾统—保大', note: '耶律濬之子；金崛起，1125年被俘，辽亡。' }),
        ]),
      ]),
      d('jin', '金', '1115—1234', '女真完颜氏建立，灭辽、灭北宋，与南宋对峙。1234年在蒙古与南宋夹击下亡。', [
        h('jin-house', '完颜氏女真', '劾里钵追尊，太祖至末帝。', [
          n('jin-helibo', '完颜劾里钵', '完颜劾里钵', '追尊', null, '追尊', { temple: '金世祖（追尊）', year: 1115, status: 'honored', note: '完颜阿骨打之父，女真完颜部首领；金建立后追尊世祖。' }),
          n('jin-taizu', '金太祖', '完颜阿骨打', '1115—1123', 'jin-helibo', '子', { temple: '太祖', year: 1115, era: '收国—天辅', note: '起兵反辽，1115年建金；创猛安谋克。' }),
          n('jin-taizong', '金太宗', '完颜吴乞买', '1123—1135', 'jin-helibo', '子', { temple: '太宗', year: 1123, era: '天会', note: '灭辽、灭北宋；推行汉制。' }),
          n('jin-xizong', '金熙宗', '完颜亶', '1135—1150', 'jin-taizu', '孙', { temple: '熙宗', year: 1135, era: '天会—皇统', note: '太祖孙；推行汉化，后被完颜亮弑杀。' }),
          n('jin-hailing', '海陵王', '完颜亮', '1150—1161', 'jin-taizu', '孙', { temple: '海陵王', year: 1150, era: '天德—正隆', note: '弑君夺位，迁都燕京；南征采石矶失败，被部下所杀。' }),
          n('jin-shizong', '金世宗', '完颜雍', '1161—1189', 'jin-taizu', '孙', { temple: '世宗', year: 1161, era: '大定', note: '“小尧舜”；与南宋隆兴和议，金朝鼎盛。' }),
          n('jin-zhangzong', '金章宗', '完颜璟', '1189—1208', 'jin-shizong', '孙', { temple: '章宗', year: 1189, era: '明昌—泰和', note: '世宗孙；文化兴盛，北方蒙古崛起。' }),
          n('jin-weishao', '卫绍王', '完颜永济', '1208—1213', 'jin-shizong', '子', { temple: '卫绍王', year: 1208, era: '大安—崇庆', note: '世宗子；蒙古南下，中都危急，被弑。' }),
          n('jin-xuanzong', '金宣宗', '完颜珣', '1213—1224', 'jin-shizong', '孙', { temple: '宣宗', year: 1213, era: '贞祐—兴定', note: '南迁汴京；与南宋、西夏、蒙古多线作战。' }),
          n('jin-aizong', '金哀宗', '完颜守绪', '1224—1234', 'jin-xuanzong', '子', { temple: '哀宗', year: 1224, era: '正大—天兴', note: '困守蔡州；1234年城破自缢，金亡。' }),
          n('jin-modi', '金末帝', '完颜承麟', '1234', 'jin-aizong', '宗室', { temple: '末帝', year: 1234, era: '盛昌', note: '哀宗传位宗室，即位当日城破战死。' }),
        ]),
      ]),
      d('yuan', '元', '1206—1368', '成吉思汗统一蒙古，忽必烈建元。元朝皇位在窝阔台、拖雷两系间反复；1368年明军入大都，元廷北遁。', [
        h('yuan-house', '孛儿只斤氏', '成吉思汗至顺帝。', [
          n('yuan-taizu', '元太祖', '铁木真', '1206—1227', null, '开国', { temple: '太祖', year: 1206, era: '太祖', status: 'honored', note: '统一蒙古各部，1206年称成吉思汗；元建立后追尊太祖。' }),
          n('yuan-taizong', '元太宗', '窝阔台', '1229—1241', 'yuan-taizu', '子', { temple: '太宗', year: 1229, era: '太宗', note: '继承大汗位，灭金；发动长子西征。' }),
          n('yuan-dingzong', '元定宗', '贵由', '1246—1248', 'yuan-taizong', '子', { temple: '定宗', year: 1246, era: '定宗', note: '窝阔台长子；在位两年，汗位转入拖雷系。' }),
          n('yuan-xianzong', '元宪宗', '蒙哥', '1251—1259', 'yuan-taizu', '孙', { temple: '宪宗', year: 1251, era: '宪宗', note: '拖雷长子；攻南宋，死于钓鱼城下。' }),
          n('yuan-shizu', '元世祖', '忽必烈', '1260—1294', 'yuan-taizu', '孙', { temple: '世祖', year: 1260, era: '中统—至元', note: '拖雷第四子；1271年建元，1279年灭南宋。' }),
          n('yuan-chengzong', '元成宗', '铁穆耳', '1294—1307', 'yuan-shizu', '孙', { temple: '成宗', year: 1294, era: '元贞—大德', note: '忽必烈孙，真金之子；维持守成局面。' }),
          n('yuan-wuzong', '元武宗', '海山', '1307—1311', 'yuan-shizu', '曾孙', { temple: '武宗', year: 1307, era: '至大', note: '答剌麻八剌之子；与弟爱育黎拔力八达约定兄终弟及。' }),
          n('yuan-renzong', '元仁宗', '爱育黎拔力八达', '1311—1320', 'yuan-shizu', '曾孙', { temple: '仁宗', year: 1311, era: '皇庆—延祐', note: '武宗弟；恢复科举，推行汉法。' }),
          n('yuan-yingzong', '元英宗', '硕德八剌', '1320—1323', 'yuan-renzong', '子', { temple: '英宗', year: 1320, era: '至治', note: '仁宗子；南坡之变中被杀。' }),
          n('yuan-taiding', '元泰定帝', '也孙铁木儿', '1323—1328', 'yuan-shizu', '曾孙', { temple: '泰定帝', year: 1323, era: '泰定—致和', note: '甘麻剌之子；南坡之变后被拥立。' }),
          n('yuan-tianshun', '元天顺帝', '阿速吉八', '1328', 'yuan-taiding', '子', { temple: '天顺帝', year: 1328, era: '天顺', note: '泰定帝子；两都之战中败于文宗。' }),
          n('yuan-mingzong', '元明宗', '和世㻋', '1329', 'yuan-wuzong', '子', { temple: '明宗', year: 1329, era: '天历', note: '武宗长子；被文宗迎立，旋暴卒。' }),
          n('yuan-wenzong', '元文宗', '图帖睦尔', '1328—1329；1329—1332', 'yuan-wuzong', '子', { temple: '文宗', year: 1328, era: '天历—至顺', note: '武宗次子；两都之战后即位，后让位明宗又复位。' }),
          n('yuan-ningzong', '元宁宗', '懿璘质班', '1332', 'yuan-mingzong', '子', { temple: '宁宗', year: 1332, era: '至顺', note: '明宗子；七岁即位，在位月余而夭。' }),
          n('yuan-shundi', '元顺帝', '妥懽帖睦尔', '1333—1368', 'yuan-mingzong', '子', { temple: '顺帝', year: 1333, era: '元统—至正', note: '明宗子；元末农民起义，1368年北遁，元亡。' }),
        ]),
      ]),
      d('ming', '明', '1368—1644', '朱元璋建明，废丞相、设锦衣卫；永乐迁都北京。皇位在太祖、成祖两系间转移；1644年李自成入北京，明亡。', [
        h('ming-house', '朱氏明室', '太祖至思宗。', [
          n('ming-taizu', '明太祖', '朱元璋', '1368—1398', null, '开国', { temple: '太祖', year: 1368, era: '洪武', note: '贫农出身，参加红巾军；1368年称帝，废丞相，设锦衣卫。' }),
          n('ming-jianwen', '明惠帝', '朱允炆', '1398—1402', 'ming-taizu', '孙', { temple: '惠帝', year: 1398, era: '建文', note: '太子朱标之子；削藩引发靖难之役，下落不明。' }),
          n('ming-chengzu', '明成祖', '朱棣', '1402—1424', 'ming-taizu', '子', { temple: '成祖', year: 1402, era: '永乐', note: '燕王起兵夺位；迁都北京，派郑和下西洋，修《永乐大典》。' }),
          n('ming-renzong', '明仁宗', '朱高炽', '1424—1425', 'ming-chengzu', '子', { temple: '仁宗', year: 1424, era: '洪熙', note: '在位不足一年；与宣宗并称“仁宣之治”。' }),
          n('ming-xuanzong', '明宣宗', '朱瞻基', '1425—1435', 'ming-renzong', '子', { temple: '宣宗', year: 1425, era: '宣德', note: '仁宣之治；设内书堂，宦官开始读书参政。' }),
          n('ming-yingzong', '明英宗', '朱祁镇', '1435—1449；1457—1464', 'ming-xuanzong', '子', { temple: '英宗', year: 1435, era: '正统—天顺', note: '土木堡之变被瓦剌俘；复位后杀于谦。' }),
          n('ming-jingtai', '明代宗', '朱祁钰', '1449—1457', 'ming-xuanzong', '子', { temple: '代宗', year: 1449, era: '景泰', note: '英宗被俘后即位，任用于谦保卫北京；英宗复辟后被废。' }),
          n('ming-xianzong', '明宪宗', '朱见深', '1464—1487', 'ming-yingzong', '子', { temple: '宪宗', year: 1464, era: '成化', note: '宠万贵妃，设西厂；荆襄流民问题突出。' }),
          n('ming-xiaozong', '明孝宗', '朱祐樘', '1487—1505', 'ming-xianzong', '子', { temple: '孝宗', year: 1487, era: '弘治', note: '“弘治中兴”；勤政宽仁，一夫一妻。' }),
          n('ming-wuzong', '明武宗', '朱厚照', '1505—1521', 'ming-xiaozong', '子', { temple: '武宗', year: 1505, era: '正德', note: '荒嬉豹房；应州之战，自封“威武大将军”。' }),
          n('ming-shizong', '明世宗', '朱厚熜', '1521—1567', 'ming-xiaozong', '侄', { temple: '世宗', year: 1521, era: '嘉靖', note: '兴献王之子；大礼议，崇道，严嵩专权，倭寇猖獗。' }),
          n('ming-muzong', '明穆宗', '朱载坖', '1567—1572', 'ming-shizong', '子', { temple: '穆宗', year: 1567, era: '隆庆', note: '隆庆开关、俺答封贡；在位六年。' }),
          n('ming-shenzong', '明神宗', '朱翊钧', '1572—1620', 'ming-muzong', '子', { temple: '神宗', year: 1572, era: '万历', note: '张居正改革；后期怠政，万历三大征，辽东危机。' }),
          n('ming-guangzong', '明光宗', '朱常洛', '1620', 'ming-shenzong', '子', { temple: '光宗', year: 1620, era: '泰昌', note: '在位仅一月，红丸案。' }),
          n('ming-xizong', '明熹宗', '朱由校', '1620—1627', 'ming-guangzong', '子', { temple: '熹宗', year: 1620, era: '天启', note: '木匠皇帝；魏忠贤专权，东林党祸。' }),
          n('ming-sizong', '明思宗', '朱由检', '1627—1644', 'ming-guangzong', '子', { temple: '思宗', year: 1627, era: '崇祯', note: '铲除魏忠贤，勤政但刚愎；李自成入北京，自缢煤山。' }),
        ]),
      ]),
      d('qing', '清', '1616—1912', '努尔哈赤建后金，皇太极改国号清。1644年入关，康雍乾盛世后转向衰落；1912年溥仪退位。', [
        h('qing-house', '爱新觉罗氏', '太祖至逊帝。', [
          n('qing-taizu', '清太祖', '努尔哈赤', '1616—1626', null, '开国', { temple: '太祖', year: 1616, era: '天命', note: '统一女真各部，1616年建后金；创八旗制度。' }),
          n('qing-taizong', '清太宗', '皇太极', '1626—1643', 'qing-taizu', '子', { temple: '太宗', year: 1626, era: '天聪—崇德', note: '改国号清、改族称满洲；松锦之战重创明军。' }),
          n('qing-shizu', '清世祖', '福临', '1643—1661', 'qing-taizong', '子', { temple: '世祖', year: 1644, era: '顺治', note: '六岁即位，1644年入关；多尔衮摄政。' }),
          n('qing-shengzu', '清圣祖', '玄烨', '1661—1722', 'qing-shizu', '子', { temple: '圣祖', year: 1661, era: '康熙', note: '平三藩、收台湾、抗俄、征噶尔丹；在位六十一年。' }),
          n('qing-shizong', '清世宗', '胤禛', '1722—1735', 'qing-shengzu', '子', { temple: '世宗', year: 1722, era: '雍正', note: '摊丁入地、改土归流、设军机处；勤政而严苛。' }),
          n('qing-gaozong', '清高宗', '弘历', '1735—1796', 'qing-shizong', '子', { temple: '高宗', year: 1735, era: '乾隆', note: '十全武功、修《四库全书》；晚年吏治腐败。' }),
          n('qing-renzong', '清仁宗', '颙琰', '1796—1820', 'qing-gaozong', '子', { temple: '仁宗', year: 1796, era: '嘉庆', note: '诛和珅；白莲教起义，清朝由盛转衰。' }),
          n('qing-xuanzong', '清宣宗', '旻宁', '1820—1850', 'qing-renzong', '子', { temple: '宣宗', year: 1820, era: '道光', note: '鸦片战争失败，签《南京条约》。' }),
          n('qing-wenzong', '清文宗', '奕詝', '1850—1861', 'qing-xuanzong', '子', { temple: '文宗', year: 1850, era: '咸丰', note: '太平天国、第二次鸦片战争；避居热河。' }),
          n('qing-muzong', '清穆宗', '载淳', '1861—1874', 'qing-wenzong', '子', { temple: '穆宗', year: 1861, era: '同治', note: '幼年即位，慈禧太后垂帘；同治中兴。' }),
          n('qing-dezong', '清德宗', '载湉', '1874—1908', 'qing-xuanzong', '孙', { temple: '德宗', year: 1874, era: '光绪', note: '奕譞之子；戊戌变法失败，被慈禧幽禁。' }),
          n('qing-xuantong', '清逊帝', '溥仪', '1908—1912', 'qing-xuanzong', '曾孙', { temple: '逊帝', year: 1908, era: '宣统', note: '载沣之子；1912年退位，清朝灭亡。' }),
        ]),
      ]),
    ],
  };
})();
