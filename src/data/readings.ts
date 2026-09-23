import type { Reading } from '../types'

export const readings: Reading[] = [
  {
    id: 'a2-1-technology-001', title: 'Why We Update Our Phones', level: 'A2.1', topic: 'Technology', estimatedMinutes: 3,
    targetVocabulary: ['update', 'device', 'although'], grammar: ['present-simple', 'adverbs-of-frequency'],
    text: `Most phones ask us to install updates. An update is a small package of new software for a device. Some people install it immediately, but others wait for many weeks. They worry that an update will change the screen or make the phone slow.

Updates are important for several reasons. First, they fix mistakes in the software. A button may not work correctly, or an app may close without warning. The company can repair these problems in an update. Second, updates make phones safer. People discover new online dangers every day, so phone companies need to protect our information. Finally, an update can add a useful feature, such as a better camera tool or a new way to organize messages.

Although updates are helpful, it is smart to prepare first. Connect the phone to Wi-Fi because the download can use a lot of data. Make sure the battery has enough power. It is also a good idea to save important photos and contacts before a large update.

You do not always need the newest phone. A regular update can help an older device work well for longer. This saves money and also creates less electronic waste. The next time your phone shows an update message, read the information, prepare your device, and choose a convenient time to install it.`,
    questions: [
      { question: 'Why do updates make phones safer?', options: ['They protect information from new dangers', 'They make the screen larger', 'They remove the battery'], correctIndex: 0 },
      { question: 'What should you do before a large update?', options: ['Delete every contact', 'Save important photos and contacts', 'Buy a new phone'], correctIndex: 1 },
      { question: 'How can updates help the environment?', options: ['They use more data', 'They make phones heavier', 'They help older devices last longer'], correctIndex: 2 },
    ],
  },
  {
    id: 'a2-1-daily-001', title: 'A Better Morning Routine', level: 'A2.1', topic: 'Daily Life', estimatedMinutes: 3,
    targetVocabulary: ['routine', 'focus', 'improve'], grammar: ['present-simple', 'sequencing-words'],
    text: `Marta used to begin every morning in a hurry. She checked messages in bed, got up late, and often left home without breakfast. At work, she felt tired and found it difficult to focus. She wanted to improve her mornings, but she did not want a complicated plan.

She decided to change three small things. First, she put her phone on a table across the room. When the alarm rang, she had to stand up to stop it. She then opened the curtains and drank a glass of water. Second, she prepared breakfast and her work bag the night before. This saved ten minutes in the morning. Finally, she walked to the bus stop instead of taking a short taxi ride.

The new routine was not perfect from the first day. Sometimes Marta still looked at her phone for too long. On cold mornings, she did not want to walk. However, after two weeks, the routine became easier. She arrived at work with more energy and was ready to start her tasks.

Marta learned that a better morning does not require waking up at five or following a long list of rules. A few simple actions can make a clear difference. Now she changes only one habit at a time and gives herself enough time to practise it.`,
    questions: [
      { question: 'Why did Marta put her phone across the room?', options: ['To charge it faster', 'To make herself get out of bed', 'To hide it from visitors'], correctIndex: 1 },
      { question: 'What did she prepare at night?', options: ['Breakfast and her work bag', 'A taxi and some water', 'Her office tasks'], correctIndex: 0 },
      { question: 'What lesson did Marta learn?', options: ['Only difficult plans work', 'She must wake at five', 'Small changes can improve a morning'], correctIndex: 2 },
    ],
  },
  {
    id: 'a2-1-work-001', title: 'My First Week Working from Home', level: 'A2.1', topic: 'Work', estimatedMinutes: 3,
    targetVocabulary: ['remote', 'schedule', 'balance'], grammar: ['past-simple', 'time-expressions'],
    text: `Last month, Leo started a remote job with a small design company. He was excited because he did not need to travel across the city every morning. On his first day, he opened his laptop at the kitchen table and joined a video meeting with his new team.

At first, working from home seemed easy. Leo wore comfortable clothes and made lunch in his own kitchen. But he soon noticed some problems. His neighbor played loud music, and his cat walked across the keyboard during meetings. Leo also worked later than usual because he did not have a clear finish time.

On Wednesday, his manager helped him create a simple schedule. Leo began work at nine, took a short break at eleven, and stopped at five thirty. He moved his desk away from the noisy wall and put his phone in another room when he needed to focus. At lunchtime, he went outside for a twenty-minute walk.

By Friday, Leo felt more comfortable. Remote work still required planning, but he enjoyed the quiet time for creative tasks. He also understood that work-life balance does not happen automatically at home. A clear schedule, regular breaks, and a separate work space helped him finish the week with energy for his friends and hobbies.`,
    questions: [
      { question: 'Where did Leo work on his first day?', options: ['At the kitchen table', 'In a city café', 'At his manager’s house'], correctIndex: 0 },
      { question: 'Why did he work late at first?', options: ['His laptop was broken', 'He had no clear finish time', 'He started after lunch'], correctIndex: 1 },
      { question: 'What helped Leo’s work-life balance?', options: ['More video meetings', 'Loud music', 'A clear schedule and regular breaks'], correctIndex: 2 },
    ],
  },
  {
    id: 'a2-2-travel-001', title: 'A Day Without a Travel Plan', level: 'A2.2', topic: 'Travel', estimatedMinutes: 3,
    targetVocabulary: ['journey', 'local', 'explore'], grammar: ['past-simple', 'because-and-so'],
    text: `Nora usually plans every part of a trip. She chooses restaurants, buys museum tickets, and makes a list of places to visit. During a weekend in a small coastal town, however, heavy rain changed all her plans. The boat journey to an island was cancelled, and the outdoor market closed early.

At first, Nora felt disappointed. She sat in a café and looked at her long list. Then the café owner suggested that she explore the streets behind the old church. The rain was becoming lighter, so Nora put on her coat and went outside.

She found a local bookshop in a narrow street. The owner showed her photographs of the town from fifty years ago. Next, she visited a tiny bakery and tried a warm cake made with oranges. A family at the bakery told her about a path along the cliffs. By the afternoon, the sky was clear, and Nora walked part of the path. She could see fishing boats returning to the harbor.

None of these places appeared in Nora’s travel guide. At dinner, she realized that the unplanned day was her favorite part of the weekend. Planning can save time and prevent problems, but it can also make us hurry. Now Nora leaves one free day in every trip. She still makes lists, but she also gives herself time to follow local advice and discover something unexpected.`,
    questions: [
      { question: 'Why was the boat journey cancelled?', options: ['The island was closed', 'There was heavy rain', 'Nora was late'], correctIndex: 1 },
      { question: 'Who suggested the old streets?', options: ['The café owner', 'A boat driver', 'Nora’s guide'], correctIndex: 0 },
      { question: 'How did the experience change Nora’s travel style?', options: ['She stopped travelling', 'She only visits islands', 'She now leaves a free day'], correctIndex: 2 },
    ],
  },
  {
    id: 'a2-2-culture-001', title: 'The Library of Things', level: 'A2.2', topic: 'Culture', estimatedMinutes: 3,
    targetVocabulary: ['borrow', 'useful', 'choice'], grammar: ['can-and-could', 'comparatives'],
    text: `Most libraries lend books, but a library in Maya’s town lends many other things. People can borrow tools, kitchen machines, games, camping equipment, and even musical instruments. The project is called the Library of Things, and it opened inside an old community center last year.

Maya first heard about it when she needed a drill to put up a shelf. Buying a new drill was expensive, and she knew she would only use it once or twice. At the library, she paid a small yearly fee and borrowed one for three days. A volunteer showed her how to use it safely.

The service is useful for people with small homes because they do not need to store equipment. It also reduces waste. Many objects require metal, plastic, and energy to produce, but they spend most of their life inside a cupboard. When twenty families share one machine, fewer machines need to be made.

The library has also become a place where people meet. Volunteers repair broken objects on Saturday mornings, and members share advice about cooking, gardening, and home projects. Maya now visits once a month. Her latest choice was a pasta machine for a family dinner.

The Library of Things cannot replace every shop, and popular items are sometimes unavailable. Still, it gives people another option: before buying something new, they can ask whether borrowing is enough.`,
    questions: [
      { question: 'Why did Maya borrow a drill?', options: ['She wanted to sell it', 'She only needed it a few times', 'Her neighbor lost one'], correctIndex: 1 },
      { question: 'How does sharing equipment reduce waste?', options: ['Fewer objects need to be produced', 'Objects become smaller', 'The library closes cupboards'], correctIndex: 0 },
      { question: 'What else happens at the library?', options: ['People repair objects and share advice', 'People buy new cars', 'People take school exams'], correctIndex: 0 },
    ],
  },
  {
    id: 'a2-2-stories-001', title: 'The Light Across the Street', level: 'A2.2', topic: 'Short Stories', estimatedMinutes: 3,
    targetVocabulary: ['notice', 'nervous', 'eventually'], grammar: ['past-continuous', 'past-simple'],
    text: `Every evening, Sam walked home from the train station at about ten. Most shops were closed, and the street was quiet. One Tuesday, he noticed a blue light moving inside an empty apartment across the street. The building had no residents because workers were repairing it.

Sam stopped and watched. The blue light moved from one window to another. He felt nervous and thought someone might be inside. He considered calling the police, but first he phoned Lina, his friend who lived next to the building. Lina looked from her balcony and saw the light too.

While they were talking, the light suddenly disappeared. Then it returned on the top floor. Sam and Lina walked to the entrance together. They did not go inside, but they looked through a glass door. On the floor, they saw a small machine with a blue lamp. It moved slowly, turned around, and moved again.

The next morning, Sam spoke to one of the workers. The mysterious machine was a robot that checked rooms during the night. It made maps and found areas that needed more work. The workers had forgotten to close a curtain, so the light was visible from the street.

Sam was relieved, although he also felt a little foolish. Lina laughed and said that they had solved a modern mystery. Eventually, the repairs finished and people moved into the building. Sam never saw the blue light again.`,
    questions: [
      { question: 'Why was the apartment building empty?', options: ['Workers were repairing it', 'It was a train station', 'Everyone was at dinner'], correctIndex: 0 },
      { question: 'What produced the blue light?', options: ['A television', 'A mapping robot', 'A police car'], correctIndex: 1 },
      { question: 'How did Sam feel after learning the truth?', options: ['Angry and tired', 'Relieved and a little foolish', 'Still frightened'], correctIndex: 1 },
    ],
  },
  {
    id: 'a2-3-programming-001', title: 'The Bug That Taught the Team', level: 'A2.3', topic: 'Programming', estimatedMinutes: 4,
    targetVocabulary: ['mistake', 'solution', 'reliable'], grammar: ['past-simple', 'relative-clauses'],
    text: `A small software team was preparing a calendar app for a public test. The app worked well during the day, but every night at midnight, some events moved to the next date. The problem did not happen on every computer, so it was difficult to understand.

At first, each developer checked a different part of the code. One person studied the calendar screen, another checked the database, and a third tested the app on several phones. They found many small mistakes, but none of them caused the midnight problem.

Then Ana, the newest developer, asked a simple question: were all the test phones using the same time zone? They were not. The app saved local time instead of one standard time. When midnight arrived in one country, the date changed for users somewhere else. The team finally had a clear explanation.

Their first solution fixed the immediate bug, but Ana suggested a second step. They created automatic tests with users in different countries and at different times of day. These tests made the app more reliable and could prevent similar problems in the future.

The team did not blame the person who wrote the original code. Instead, they wrote a short report about what happened and shared it with the whole company. The bug taught them that good software depends on clear questions, varied testing, and a team where new members feel comfortable speaking.`,
    questions: [
      { question: 'When did events move to the wrong date?', options: ['At lunch', 'At midnight', 'Every Friday'], correctIndex: 1 },
      { question: 'What caused the bug?', options: ['Different time zones', 'A broken phone screen', 'Too many users'], correctIndex: 0 },
      { question: 'What did the team add after fixing it?', options: ['More calendar colors', 'Automatic tests for different places and times', 'A new manager'], correctIndex: 1 },
    ],
  },
  {
    id: 'a2-3-business-001', title: 'Listening Before a Product Launch', level: 'A2.3', topic: 'Business', estimatedMinutes: 4,
    targetVocabulary: ['customer', 'feedback', 'launch'], grammar: ['present-perfect', 'reported-ideas'],
    text: `A company called North Cup wanted to launch a reusable travel mug. The first design looked attractive and kept drinks warm for six hours. The team believed it was ready, so they gave fifty sample mugs to potential customers for one week.

The feedback surprised them. Most people liked the color and size, but several customers said the lid was difficult to clean. Cyclists explained that the mug did not fit well in a bicycle holder. One customer with small hands found the mug too wide. These problems had not appeared in the office because the design team used the mug in the same way every day.

The launch was only one month away. Changing the product would cost time and money, but the manager decided to wait. The team made the bottom narrower, simplified the lid, and added a rough band around the middle. They then gave the new version to the same group.

This time, the response was much better. People could clean the lid quickly, and the mug was easier to hold. The cyclists confirmed that it fit their holders. North Cup launched the product six weeks later than planned, but sales were strong and very few customers returned it.

The team learned that feedback is not just a final check. It is most useful when there is still time to make changes. A short delay before launch can prevent a much larger problem afterward.`,
    questions: [
      { question: 'What was difficult to clean?', options: ['The lid', 'The bicycle', 'The rough band'], correctIndex: 0 },
      { question: 'Why had the team missed the problems?', options: ['They never saw the mug', 'They all used it in the same way', 'Customers hid the feedback'], correctIndex: 1 },
      { question: 'What happened after the delayed launch?', options: ['Sales were strong', 'The company closed', 'Everyone returned the mug'], correctIndex: 0 },
    ],
  },
  {
    id: 'a2-3-daily-001', title: 'The Repair Café', level: 'A2.3', topic: 'Daily Life', estimatedMinutes: 4,
    targetVocabulary: ['reduce', 'waste', 'manage'], grammar: ['present-perfect', 'first-conditional'],
    text: `On the first Sunday of each month, a school hall in Bruno’s neighborhood becomes a repair café. People bring broken lamps, clothes, bicycles, and small kitchen machines. Volunteers help them understand the problem and, if possible, repair the item together.

Bruno visited for the first time with a toaster that had stopped working. He expected to leave it at a desk and collect it later, but that was not how the café worked. A volunteer named Priya asked him to open the toaster with her. She explained each step and showed him a loose wire inside.

They managed to reconnect the wire in twenty minutes. The toaster worked again, and Bruno learned how to check a simple electrical problem safely. At another table, someone was sewing a jacket while a child learned to repair a bicycle tire.

The café has repaired more than four hundred objects in two years. This helps reduce waste, but the organizers say learning is equally important. If people understand how things work, they may care for them better and keep them longer. Visitors also meet neighbors who have different skills.

Not every object can be saved. Some machines require special parts, and dangerous repairs must go to professionals. The volunteers are clear about these limits. Bruno now helps at the welcome table. He cannot repair everything, but he can make tea, label objects, and help new visitors feel comfortable.`,
    questions: [
      { question: 'How is the repair café different from a normal shop?', options: ['Visitors help with the repair', 'It only repairs cars', 'Everything is new'], correctIndex: 0 },
      { question: 'What was wrong with Bruno’s toaster?', options: ['It had no bread', 'It had a loose wire', 'It was too large'], correctIndex: 1 },
      { question: 'Why is learning important at the café?', options: ['People can care for objects better', 'People can sell more tea', 'Children can leave school'], correctIndex: 0 },
    ],
  },
  {
    id: 'a2-4-culture-001', title: 'A Festival That Found a New Home', level: 'A2.4', topic: 'Culture', estimatedMinutes: 4,
    targetVocabulary: ['tradition', 'gather', 'memory'], grammar: ['present-perfect', 'used-to'],
    text: `For more than eighty years, families in Bellavista have gathered in the main square for a spring music festival. Local bands play, neighbors prepare food, and children make paper flowers for the stage. The festival is an important tradition and a strong memory for many older residents.

Last year, engineers discovered that the old square needed major repairs. The work would take eight months, so the festival committee had to find a new place. Some residents wanted to cancel the event. They believed it would not feel the same anywhere else.

A group of younger volunteers suggested using the riverside park. It was larger than the square but had no stage or electricity. Over several weekends, people worked together. A building company lent wood for a temporary stage, restaurants provided lights, and students painted signs. The committee also created a quiet area for older visitors.

On the festival day, strong wind arrived in the morning. Volunteers tied the decorations more carefully and moved some activities inside large tents. By afternoon, the wind had stopped. More than two thousand people came, which was the largest audience in the festival’s history.

The new place changed the event. There was room for dancing, and visitors could sit near the river. When the square reopened, the committee faced another choice. In the end, they decided to use both locations: a small opening concert in the traditional square and the main celebration in the park. The temporary solution had created a new tradition without removing the old one.`,
    questions: [
      { question: 'Why could the festival not use the square?', options: ['It needed major repairs', 'Music was forbidden', 'The park was closed'], correctIndex: 0 },
      { question: 'What problem happened on festival morning?', options: ['The river flooded', 'Strong wind arrived', 'The bands forgot the music'], correctIndex: 1 },
      { question: 'What did the committee finally decide?', options: ['To cancel future festivals', 'To return only to the square', 'To use the square and the park'], correctIndex: 2 },
    ],
  },
  {
    id: 'a2-4-work-001', title: 'Learning a Skill in Public', level: 'A2.4', topic: 'Work', estimatedMinutes: 4,
    targetVocabulary: ['opportunity', 'skill', 'confident'], grammar: ['present-perfect', 'conditionals'],
    text: `When Elena joined a marketing agency, she was comfortable writing reports but nervous about presentations. She spoke quietly and read every sentence from her notes. Her manager suggested a public speaking course, but the next course did not begin for three months.

Then Elena noticed a different opportunity. Her company held a fifteen-minute learning session every Friday. Any employee could teach the team a useful skill. Elena knew a lot about organizing online research, so she offered to lead a session.

Preparing the talk took longer than she expected. She reduced twenty slides to eight and practised with a colleague. Instead of writing complete sentences, she put only key words on small cards. During the session, her hands shook at first. However, people asked friendly questions, and Elena realized that she could answer without reading.

Afterward, three colleagues said they had used her research method. Their feedback made her more confident. Elena began volunteering for a short session every two months. Each talk still made her nervous, but the feeling became smaller and more manageable.

Six months later, Elena presented a campaign idea to an important client. She explained the plan clearly and answered unexpected questions. The client accepted the idea. Elena had not become a perfect speaker, and she still prepared carefully. She had learned something more useful: confidence often grows after action, not before it. If she waited until she felt completely ready, she might never begin.`,
    questions: [
      { question: 'What skill did Elena teach first?', options: ['Organizing online research', 'Designing buildings', 'Speaking another language'], correctIndex: 0 },
      { question: 'How did she change her notes?', options: ['She wrote a longer script', 'She used only key words', 'She removed every note'], correctIndex: 1 },
      { question: 'What did Elena learn about confidence?', options: ['It can grow after taking action', 'It arrives without practice', 'Only managers can give it'], correctIndex: 0 },
    ],
  },
]

export const readingById = (id: string) => readings.find((reading) => reading.id === id)
export const countWords = (text: string) => text.trim().split(/\s+/).length
