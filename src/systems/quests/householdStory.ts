import type { ChapterId } from '../../../schemas/game-state'
import { getObjective, type TargetId } from '../interaction/household'

interface StoryBeat {
  speaker: string
  text: string
  completed?: { quest: string; flag: string; chapter?: ChapterId; item?: string }
}

export function householdStory(target: TargetId, flags: Record<string, boolean>, language: 'en' | 'hi'): StoryBeat {
  const hindi = language === 'hi'
  const you = (en: string, hi: string): StoryBeat => ({ speaker: hindi ? 'देवराज' : 'Devraj', text: hindi ? hi : en })
  const ma = (en: string, hi: string): StoryBeat => ({ speaker: hindi ? 'माँ' : 'Ma', text: hindi ? hi : en })
  const artisan = (en: string, hi: string): StoryBeat => ({ speaker: hindi ? 'मोहन काका' : 'Mohan Kaka', text: hindi ? hi : en })
  switch (target) {
    case 'npc_mother': {
      const objective = getObjective(flags).questId
      if (!objective) return ma('Come and sit with me a minute. Can you hear the people coming up the lane?', 'ज़रा मेरे पास बैठो। सुन रहे हो? गली से लोगों की आवाज़ आ रही है।')
      if (objective === 'q_prasad_share') return {
        ...ma('The first light is still with us. Let us share the morning with everyone who made room for this household. Then you can rest.', 'पहली रोशनी अभी हमारे साथ है। जिसने इस घर के लिए जगह बनाई, उसके साथ सुबह बाँटते हैं। फिर तुम आराम करना।'),
        completed: { quest: 'q_prasad_share', flag: 'prasad_shared', chapter: 'parana-epilogue' },
      }
      if (objective === 'q_return_home') return {
        ...ma('You saw them at the steps? When we go down for sunrise, I’ll know whose hands made room for us there. Come sit beside me.', 'पड़ोसी सीढ़ियों पर मिले? जब हम उगते सूरज को देखने जाएँगे, मुझे याद रहेगा कि हमारे लिए वहाँ किसने जगह बनाई। आओ, पास बैठो।'),
        completed: { quest: 'q_return_home', flag: 'homecoming_shared' },
      }
      if (objective === 'q_ghat_clean') return ma('Will you look in on the neighbours at the pond steps? I’d like to hear how they’re getting on.', 'तालाब की सीढ़ियों पर पड़ोसियों से मिल आओगे? उनका हाल जानने का मन है।')
      if (objective === 'q_bamboo_visit') return ma('I’ll stay with the grain. Mohan Kaka is mending our basket down the lane. Go and see him while the morning is cool.', 'मैं गेहूँ के पास बैठती हूँ। गली में मोहन काका हमारी टोकरी ठीक कर रहे हैं। धूप तेज़ होने से पहले उनसे मिल आओ।')
      if (objective === 'q_wheat_sort') return ma('That gives us some room. Spread the wheat across the mat for me. I’ll take the first turn watching for birds.', 'अब जगह बन गई। गेहूँ चटाई पर फैला दो। पहले मैं बैठती हूँ, चिड़ियों पर नज़र रखूँगी।')
      if (objective === 'q_courtyard_clean') return ma('The broom is at the left end of the veranda. I’ll keep the baskets out of your way.', 'झाड़ू बरामदे की बाईं तरफ़ है। मैं टोकरियाँ हटा देती हूँ।')
      return {
        ...ma('You’re home. Come here, let me look at you. I’m sorting the baskets for Chhath. Will you sweep the leaves beside the mat? Your uncle brought the wheat this morning.', 'आ गए! पास आओ, ज़रा तुम्हें देख लूँ। मैं छठ की टोकरियाँ सँभाल रही हूँ। चटाई के पास की पत्तियाँ बुहार दोगे? चाचा सुबह गेहूँ ले आए हैं।'),
        completed: { quest: 'q_arrival_talk', flag: 'talked_to_mother', chapter: 'courtyard-preparation' },
      }
    }
    case 'prop_broom':
      if (flags.courtyard_cleaned) return you('There’s room beside the mat now. I’ll leave the broom here for whoever needs it next.', 'चटाई के पास अब जगह है। झाड़ू यहीं रख देता हूँ ताकि जिसे चाहिए, ले सके।')
      if (!flags.talked_to_mother) return you('The grass broom is still by the veranda. I’ll ask Ma where she wants a hand first.', 'झाड़ू अब भी बरामदे के पास है। पहले माँ से पूछ लूँ कि कहाँ हाथ बँटाऊँ।')
      return {
        ...you('The last leaves brush away. Now we can spread the wheat here.', 'आख़िरी पत्तियाँ भी हट गईं। अब यहाँ गेहूँ फैला सकते हैं।'),
        completed: { quest: 'q_courtyard_clean', flag: 'courtyard_cleaned', chapter: 'household-work' },
      }
    case 'prop_wheat':
      if (flags.wheat_sorted) return you('The wheat lies in an even layer. Ma is keeping an eye on it from the veranda.', 'गेहूँ की परत बराबर है। माँ बरामदे से उस पर नज़र रख रही हैं।')
      if (!flags.courtyard_cleaned) return you('Uncle left the wheat by this mat. There are still dry leaves in the way.', 'चाचा गेहूँ इसी चटाई के पास रख गए थे। यहाँ अभी सूखी पत्तियाँ पड़ी हैं।')
      return {
        ...you('I spread the grain out to the edges. Ma keeps an eye on it while I go down the lane.', 'मैं गेहूँ किनारों तक फैला देता हूँ। गली तक हो आता हूँ, तब तक माँ इस पर नज़र रखेंगी।'),
        completed: { quest: 'q_wheat_sort', flag: 'wheat_sorted', chapter: 'village-cooperation' },
      }
    case 'npc_artisan':
      if (flags.bamboo_collected) return artisan('Look at the curve along that rim. It took me two tries to get it how I wanted it.', 'किनारे का मोड़ देखो। मन जैसा बनाने में दो बार बुनना पड़ा।')
      if (!flags.wheat_sorted) return artisan('I’m finishing the rim of your family’s basket. Come along when you and Ma have seen to the wheat.', 'तुम्हारी टोकरी का किनारा बुन रहा हूँ। माँ के साथ गेहूँ का काम निपटा लो, फिर आना।')
      return {
        ...artisan('Here’s the basket your mother asked me to mend. Feel how firm the rim is now. Our neighbours are down at the pond, clearing space on the steps.', 'यह रही टोकरी। तुम्हारी माँ ने ठीक करने को दी थी। देखो, किनारा अब कितना मज़बूत है। पड़ोसी तालाब की सीढ़ियों पर जगह बना रहे हैं।'),
        completed: { quest: 'q_bamboo_visit', flag: 'bamboo_collected', item: 'woven_basket' },
      }
    case 'prop_ghat_spot':
      if (flags.dawn_witnessed) return you('The steps are bright now. I can picture our family walking down together, with room made by many hands.', 'सीढ़ियाँ अब उजली हैं। कई हाथों से बनी जगह पर हमारा परिवार साथ उतरता दिखाई देता है।')
      if (!flags.bamboo_collected) return you('The sound carries across this water. On the way back I can stop by the workshop.', 'पानी के पार तक आवाज़ जाती है। लौटते समय मोहन काका से मिलता चलूँगा।')
      if (flags.ghat_prepared) return {
        ...you('The sky has softened over the water. We can stay here quietly and notice the first light together.', 'पानी के ऊपर आकाश हल्का हो गया है। यहीं शांत रहकर पहली रोशनी को साथ देख सकते हैं।'),
        completed: { quest: 'q_dawn_walk', flag: 'dawn_witnessed', chapter: 'usha-arghya' },
      }
      return {
        ...you('Someone has swept the steps already. There’s space for us beside our neighbours. Ma will want to hear about this.', 'किसी ने सीढ़ियाँ बुहार दी हैं। पड़ोसियों के पास हमारे लिए भी जगह है। माँ को जाकर बताऊँगा।'),
        completed: { quest: 'q_ghat_clean', flag: 'ghat_prepared' },
      }
    case 'prop_goitha': return you('The goitha rest against the courtyard wall. Each still carries the shape of the hand that pressed it.', 'आँगन की दीवार पर गोइठे लगे हैं। हर एक पर बनाने वाले के हाथ की छाप है।')
    case 'prop_chulha': return you('I can see the hollow in the clay chulha and the places where a pot can rest. It’s cold this morning.', 'मिट्टी के चूल्हे का मुँह और बर्तन टिकाने की जगह दिख रही है। अभी चूल्हा ठंडा है।')
    case 'prop_baskets': return you('Ma has set the baskets on the veranda. The strips bend close together around each rim.', 'माँ ने टोकरियाँ बरामदे में रखी हैं। किनारों पर बाँस की पट्टियाँ कसकर बुनी हैं।')
    case 'prop_handpump': return you('I remember leaning my whole weight on that handle. When I was little, Uncle would steady the pot for me.', 'बचपन में इस हत्थे को दबाने के लिए पूरा ज़ोर लगाना पड़ता था। चाचा मेरा घड़ा थाम लेते थे।')
    case 'prop_sugarcane_koshi': return you('A little canopy stands back from the steps. Someday I’ll ask the family who arranged it to tell me about it.', 'सीढ़ियों से हटकर एक छोटा मंडप है। कभी इसे बनाने वाले परिवार से इसकी कहानी पूछूँगा।')
  }
}
