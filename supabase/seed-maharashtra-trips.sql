-- ============================================================
-- withinmiles.in, Maharashtra Trips Catalog (14 trips)
-- Run this whole file in: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run: existing trips (matched by slug) are updated.
-- ============================================================

-- Extended catalog columns (no-op if already added)
alter table public.trips add column if not exists best_months text;
alter table public.trips add column if not exists pickup_points text;
alter table public.trips add column if not exists departure_note text;
alter table public.trips add column if not exists price_note text;
alter table public.trips add column if not exists itinerary text;
alter table public.trips add column if not exists includes text[] not null default '{}';
alter table public.trips add column if not exists excludes text[] not null default '{}';
alter table public.trips add column if not exists things_to_carry text[] not null default '{}';

insert into public.trips
  (slug, title_en, description_en, destination, region, category,
   duration_days, duration_nights, price, start_date, end_date, image_url,
   highlights, is_active, is_featured,
   best_months, pickup_points, departure_note, price_note,
   itinerary, includes, excludes, things_to_carry)
values

-- 1. Vasota Fort Trek & Lakeside Camping
($$vasota-fort-lakeside-camping$$, $$Vasota Fort Trek & Lakeside Camping$$,
 $$Experience the ultimate weekend escape combining a scenic motorboat ride across the Koyna backwaters, lakeside tent camping under the stars, and a thrilling jungle trek to the historic Vasota Fort in the heart of the Sahyadris.$$,
 $$Satara, Maharashtra$$, 'maharashtra', 'trek', 2, 1, 1850, '2026-11-28', '2026-11-29',
 $$/images/vasota-fort-lakeside-camping.jpg$$,
 array[$$Scenic to-and-fro motorboat cruise across the Shivsagar / Koyna backwaters$$,$$Lakeside tent stay with bonfire, music, and group games under fairy lights$$,$$Guided jungle trek through the lush Koyna Wildlife Sanctuary to Vasota Fort$$,$$Panoramic views of Babu Kada cliff and Nageshwar Pinnacle from the summit$$,$$Dedicated women's changing rooms & washroom facilities at the campsite$$],
 true, true,
 $$October–March$$, $$Pune (Nashik Phata, Wakdewadi/Shivajinagar, Swargate, Katraj Chowk & NH-48 highway points)$$, null, null,
 $$Day 1: Road Trip, Lakeside Camping & Bonfire
11:30 AM – 12:35 PM: Depart from Pune via private bus (Nashik Phata, Shivajinagar, Swargate, Katraj).
04:30 PM: Arrive at the scenic lakeside campsite near Bamnoli/Tapola and check into tents.
05:30 PM: Hot evening tea with sunset views over the Shivsagar backwaters.
07:30 PM – 09:30 PM: Bonfire, music night, and group games with the withinmiles.in crew.
09:30 PM – 10:30 PM: Unlimited freshly prepared local dinner (Veg & Non-Veg spreads).
11:00 PM: Lights out and rest in tents.

Day 2: Boating, Vasota Jungle Trek & Return
05:30 AM: Wake-up call and freshen up.
06:15 AM: Hot morning tea and breakfast at the campsite.
07:00 AM: Complete Koyna Wildlife Sanctuary permit formalities and board the motorboat to Met Indavali (Vasota base).
08:15 AM: Trek briefing and begin ascent through the dense sanctuary forest trail.
10:30 AM: Reach Vasota Summit; explore the fort, Babu Kada, and Nageshwar Pinnacle views.
11:30 AM: Enjoy packed tiffin lunch (3 chapatis & bhaji) at the summit.
12:15 PM: Begin descent back to the boat jetty.
02:30 PM: Return motorboat ride across the backwaters to the campsite.
04:00 PM: Freshen up, have evening tea, and depart for Pune.
09:30 PM – 10:30 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Pune to Pune private non-AC/pushback bus transport (including tolls, parking, and driver allowances)$$,$$Lakeside tent stay on a sharing basis with mats and blankets$$,$$Dedicated women's changing rooms and washroom access at the campsite$$,$$Day 1 Evening Tea and Unlimited Dinner (Veg / Non-Veg)$$,$$Day 2 Morning Tea, Breakfast, Packed Tiffin (3 Chapatis & Bhaji), and Evening Tea$$,$$To-and-fro Koyna backwater boat ride and Koyna Forest Department entry permits$$,$$Bonfire and music session$$,$$Experienced withinmiles.in trek leaders and basic first-aid support$$],
 array[$$Lunch during Saturday's onward journey from Pune (self-sponsored highway halt)$$,$$Personal expenses, mineral water bottles, cold drinks, or camera charges at the forest gate$$,$$Any medical or emergency evacuation costs$$,$$Anything not specifically mentioned in the inclusions$$],
 array[$$Original Government Photo ID (Aadhaar / Driving License / PAN, mandatory for forest permit verification)$$,$$Good grip trekking or sports shoes (mandatory)$$,$$Comfortable trek wear (full-sleeve t-shirt and full track pants recommended for the jungle trail)$$,$$Warm jacket or hoodie for the chilly lakeside night$$,$$Extra pair of clothes$$,$$Daypack (20–30L)$$,$$Minimum 2 liters of water$$,$$Personal medicines, torch/headlamp, sunglasses, cap, and cash for personal snacks$$]),

-- 2. Dategad & Chalkewadi
($$dategad-chalkewadi$$, $$The "Sword & Blade" Trail: Dategad & Chalkewadi$$,
 $$Step away from crowded tourist circuits and trace the contrast between 17th-century rock architecture and endless wind-carved horizons. Explore the deep basalt cuts of Dategad's legendary "Talwar Vihir" (Sword Well) before wandering beneath the colossal whistling turbines of Chalkewadi Plateau.$$,
 $$Satara, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1900, null, null,
 $$/images/placeholder-trip.svg$$,
 array[$$Explore Dategad Fort (Sundargad) and the 90-foot monolithic Talwar Vihir (Sword Well)$$,$$Walk across the vast laterite tablelands of Chalkewadi Windmill Plateau at golden hour$$,$$Scenic canyon viewpoint pitstop at Thoseghar$$,$$Authentic rustic Maharashtrian village lunch (hot bhakri, pitla, and thecha) in Patan$$,$$Small, curated batch size for a mindful and unhurried Sunday experience$$],
 true, false,
 $$July–February$$, $$Pune (NH-48 highway pickups)$$, $$Sundays (Flexible)$$, $$WithinMiles Community Pass: ₹1,750$$,
 $$Day 1: Pune – Dategad – Thoseghar – Chalkewadi – Pune
04:00 AM: Depart from Pune (NH-48 highway pickups).
05:45 AM: Breakfast stop (Misal, Poha & Chai).
07:30 AM: Reach base village (Tolewadi) and start the 45-minute ridge hike.
08:15 AM – 10:00 AM: Explore Dategad Fort, the Sword Well (Talwar Vihir), ancient shrines, and cliff bastions.
10:45 AM: Descend to the base village and freshen up.
11:30 AM – 12:45 PM: Traditional Maharashtrian village lunch in Patan.
01:30 PM – 02:30 PM: Scenic canyon viewpoint break at Thoseghar.
03:00 PM – 05:00 PM: Chalkewadi Windmill Farm walk and golden hour photography.
05:15 PM: Depart via Satara with a tea and famous Satara kandi pedhe stop.
08:45 PM – 09:15 PM: Reach Pune.$$,
 array[$$Private Pune-to-Pune travel$$,$$Morning breakfast (Misal, Poha & Chai) and evening tea/snacks$$,$$Authentic local Maharashtrian village lunch$$,$$Forest/entry permits and toll charges$$,$$First aid and curated trail facilitation by withinmiles.in$$],
 array[$$Personal expenses, bottled water, cold drinks, or Satara kandi pedhe purchases$$,$$Camera charges (if applicable)$$,$$Medical or emergency evacuation expenses$$,$$Anything not mentioned in the inclusions$$],
 array[$$Trekking or sports shoes with good grip$$,$$2–2.5 liters of water$$,$$Daypack (20–30L)$$,$$Cap, sunglasses, and windcheater$$,$$Government Photo ID and personal medicines$$]),

-- 3. Rajgad
($$rajgad-pali-darwaza$$, $$Rajgad: King of Forts Trek (Via Pali Darwaza)$$,
 $$Ascend the legendary "King of Forts" via the royal stone-step route of Pali Darwaza. Traverse all three iconic machis-Padmavati, Suvela, and Sanjivani-and climb the rock-cut steps to Balekilla for sweeping panoramic views of Torna and the Sahyadri ranges.$$,
 $$Pune, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1700, null, null,
 $$/images/rajgad-pali-darwaza.jpg$$,
 array[$$Enter Rajgad through the grand Pali Darwaza via the historic stone-step trail$$,$$Explore Suvela Machi, the natural needle hole (Nedhe), and Chunyacha Buruj$$,$$Climb the rock-cut steps to Balekilla (The Citadel) overlooking Torna and the Sahyadris$$,$$Walk the fortified defensive ramparts of Sanjivani Machi$$,$$Authentic local Maharashtrian vegetarian lunch served at Padmavati Machi$$,$$Tight-knit, small batch experience (Moderate difficulty, High endurance)$$],
 true, false,
 $$June–February$$, $$Pune (Shivajinagar, Swargate, Katraj)$$, $$Every weekend / Flexible$$, null,
 $$Day 1: Pune – Pali Darwaza – Rajgad Fort – Pune
04:00 AM – 05:00 AM: Depart from Pune (Shivajinagar at 04:00 AM, Swargate at 04:30 AM, Katraj at 05:00 AM).
06:15 AM: Traditional hot breakfast and tea en route.
07:15 AM: Reach base village Pali, freshen up, and attend the trek briefing.
07:30 AM: Begin the ascent via the royal stone-step route of Pali.
09:15 AM: Enter Rajgad through the grand Pali Darwaza and regroup at Padmavati Machi.
09:30 AM: Explore Suvela Machi-walk the fortified arm, witness the Nedhe (needle hole), and inspect Chunyacha Buruj.
11:00 AM: Climb the rock-cut steps up to Balekilla (The Citadel) for panoramic Sahyadri views.
12:30 PM: Traverse along the defensive ramparts of Sanjivani Machi.
01:45 PM: Return to Padmavati Machi for a hot, authentic Maharashtrian vegetarian lunch.
02:45 PM: Begin descent back along the wide steps toward Pali.
04:45 PM: Reach base village Pali, freshen up, and board the bus.
05:30 PM: Evening tea and snacks break en route.
08:30 PM: Reach Pune (tentative, depending on weekend highway traffic).$$,
 array[$$Private non-AC transport (Pune to Pune)$$,$$Morning hot breakfast and tea$$,$$Authentic local Maharashtrian vegetarian lunch at Padmavati Machi$$,$$Evening tea and snacks en route$$,$$Fort entry fees and local permissions (if any)$$,$$First-aid kit, safety support, and experienced withinmiles.in trek leaders$$],
 array[$$Personal expenses and packaged drinking water$$,$$Anything not mentioned in the inclusions$$],
 array[$$3 litres of water (mandatory due to long exposed walks on the machis)$$,$$Good grip trekking or sports shoes$$,$$Rainwear / poncho and dry bag for electronics$$,$$Electrolytes, glucose, or trail snacks$$,$$Small backpack (20–30L)$$,$$Personal medication and an extra pair of clothes$$]),

-- 4. Nanemachi & Satsada
($$nanemachi-satsada$$, $$Nanemachi & Satsada Waterfall Trek$$,
 $$Trek through dense Konkan forest trails and shallow stream crossings from Gugulshi village near Mahad to discover the stunning Nanemachi and Satsada waterfalls. This beginner-friendly 7 km round-trip trail leads into a lush gorge featuring turquoise pools and cascading basalt rock formations.$$,
 $$Mahad, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1499, null, null,
 $$/images/placeholder-trip.svg$$,
 array[$$Witness the towering Nanemachi Waterfall and cascading Satsada Waterfall tucked inside a dense forest gorge$$,$$Beginner-friendly ~7 km round-trip trail (1 to 1.5 hours each way) with minimal elevation gain$$,$$Scenic forest trail featuring shallow stream crossings and wet basalt rock beds$$,$$Strict eco-friendly, zero-littering, and silent trail policy curated by withinmiles.in$$,$$Advisory: Zero mobile network at Gugulshi base village; full-sleeve clothing & deep-grip shoes mandatory$$],
 true, false,
 $$June–October$$, $$Pune (Shivajinagar, Swargate, Chandni Chowk)$$, $$Every weekend (Monsoon & Post-Monsoon)$$, $$Tentative, may be updated$$,
 $$Day 1: Pune – Gugulshi Village – Nanemachi & Satsada Waterfalls – Pune
04:30 AM – 05:30 AM: Depart from Pune (Shivajinagar, Swargate, Chandni Chowk via Tamhini Ghat).
07:30 AM: Hot morning breakfast and tea en route.
08:30 AM: Reach base village Gugulshi (near Mahad), freshen up, and attend safety & trail briefing.
09:00 AM: Begin the ~3.5 km (1 to 1.5 hr) trek through dense forest cover and shallow stream crossings.
10:30 AM: Arrive at Nanemachi & Satsada Waterfalls; enjoy the gorge views and capture photos safely from designated zones.
12:15 PM: Begin ~3.5 km return trek back to Gugulshi base village.
01:45 PM: Change into dry clothes and relish a hot, home-cooked local Maharashtrian lunch.
03:15 PM: Board the private bus for the return drive to Pune (with an evening tea break en route).
07:30 PM – 08:30 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Private non-AC transport (Pune to Pune)$$,$$Morning hot breakfast and tea$$,$$Authentic home-cooked local lunch at Gugulshi base village$$,$$Evening tea en route$$,$$Forest / village entry permits and local guide charges$$,$$Experienced withinmiles.in trek leaders and basic first-aid support$$],
 array[$$Personal expenses and packaged drinking water$$,$$Anything not mentioned in the inclusions$$],
 array[$$Trekking shoes or sports shoes with deep rubber grip (mandatory)$$,$$Full-sleeve t-shirts and full-length trek pants (mandatory, shorts/sleeveless not permitted)$$,$$Minimum 2–3 liters of water per person$$,$$Compact daypack with a waterproof rain cover & ziplock pouches for electronics$$,$$Poncho, rain jacket, or windcheater$$,$$Electrolytes (ORS / Glucon-D) and ready-to-eat dry snacks (chikki, dry fruits, energy bars)$$,$$Torch/headlamp, Original Government ID Proof, and personal medical kit$$,$$Post-trek dry clothes, extra socks, sandals, towel, and plastic bag for muddy shoes (leave in bus)$$]),

-- 5. Korigad
($$korigad-fort$$, $$Korigad Fort Trek (Pune to Pune)$$,
 $$Perched above Aamby Valley near Lonavala, Korigad (Koraigad) is a scenic, beginner-friendly hill fort famous for its completely intact 2-kilometer fortification wall, twin tranquil lakes at the summit, and panoramic views of Pavana Dam, Tung, and Tikona forts.$$,
 $$Lonavala, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1200, null, null,
 $$/images/korigad-fort.jpg$$,
 array[$$Beginner-friendly stone-step ascent ideal for first-time trekkers and weekend hikers$$,$$Walk the full 2 km intact perimeter ramparts offering 360-degree views of Aamby Valley and Lonavala$$,$$Explore two massive freshwater lakes, Koraidevi Temple, and historic cannons at the plateau summit$$,$$Panoramic viewpoints overlooking Pavana Dam backwaters, Tung, Tikona, and Morgiri forts$$,$$Authentic local Maharashtrian breakfast and home-style lunch included$$],
 true, false,
 $$June–February$$, $$Pune (Swargate, Shivajinagar, Wakad / Hinjawadi Flyover)$$, $$Every weekend / Flexible$$, null,
 $$Day 1: Pune – Peth Shahapur – Korigad Fort – Pune
05:30 AM – 06:30 AM: Depart from Pune (Swargate at 05:30 AM, Shivajinagar at 05:50 AM, Wakad / Hinjawadi Flyover at 06:20 AM).
07:45 AM: Traditional hot breakfast and tea en route near Lonavala / Peth Shahapur.
08:30 AM: Reach base village Peth Shahapur, freshen up, and attend the trek & safety briefing.
09:00 AM: Begin the scenic ascent through forest trails and rock-cut stone steps toward Ganesh Darwaza.
10:30 AM: Reach the Korigad summit; visit Koraidevi Temple, inspect historic cannons, and walk the 2 km perimeter fortification wall.
12:30 PM: Begin descent back toward Peth Shahapur base village.
01:45 PM: Reach base village, freshen up, and relish a hot, home-cooked Maharashtrian lunch.
03:15 PM: Board the private bus for the return journey to Pune (with an evening tea break en route).
06:00 PM – 06:30 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Private Pune-to-Pune transport (including tolls, parking, and driver allowances)$$,$$Morning hot breakfast and tea$$,$$Authentic home-style local Maharashtrian lunch (Veg / Non-Veg options)$$,$$Evening tea en route$$,$$Forest / village entry fees and local permissions$$,$$Experienced withinmiles.in trek leaders and basic first-aid support$$],
 array[$$Personal expenses, packaged drinking water, or cold drinks$$,$$Medical or emergency evacuation expenses$$,$$Anything not mentioned in the inclusions$$],
 array[$$2 litres of water (mandatory)$$,$$Good grip trekking or sports shoes (mandatory)$$,$$Rainwear / poncho and dry bag for electronics (during monsoon/post-monsoon)$$,$$Compact daypack (20–30L)$$,$$Cap, sunglasses, and personal snacks / electrolytes$$,$$Original Government Photo ID, personal medication, and an extra pair of clothes$$]),

-- 6. Rajmachi
($$rajmachi-twin-fort$$, $$Rajmachi Twin Fort Trek (Shrivardhan & Manaranjan)$$,
 $$Nestled deep in the Sahyadri ranges near Lonavala, Rajmachi is an iconic twin-fort citadel featuring two fortified peaks-Shrivardhan and Manaranjan-guarding the ancient Borghat trade route. Ascend through lush forest trails and ancient Buddhist rock-cut caves to soak in sweeping views of Kataldhar waterfall, Ulhas Valley, and Duke's Nose.$$,
 $$Lonavala, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1499, null, null,
 $$/images/rajmachi-twin-fort.jpg$$,
 array[$$Summit both twin citadels-Shrivardhan (the higher watchtower peak) and Manaranjan (overlooking Konkan)$$,$$Explore the 2nd-century BC Buddhist rock-cut Kondhane Caves and seasonal waterfalls along the trail$$,$$Panoramic views of Ulhas Valley, Tungarli Lake, Kataldhar gorge, and surrounding Sahyadri peaks$$,$$Authentic home-cooked Maharashtrian village meal at Udhewadi base village$$,$$Curated small-batch experience led by experienced withinmiles.in trek leaders$$],
 true, false,
 $$June–February$$, $$Pune (Swargate, Shivajinagar, Wakad / Hinjawadi Flyover)$$, $$Every weekend / Flexible$$, null,
 $$Day 1: Pune – Kondhane – Udhewadi – Shrivardhan & Manaranjan Forts – Pune
05:00 AM – 06:00 AM: Depart from Pune (Swargate at 05:00 AM, Shivajinagar at 05:25 AM, Wakad / Hinjawadi Flyover at 05:55 AM).
07:15 AM: Hot breakfast and tea en route near Karjat / base region.
08:15 AM: Reach base village, freshen up, and attend the safety & trail briefing.
08:45 AM: Begin the ascent through dense forest trails, passing the historic Kondhane rock-cut caves.
11:00 AM: Reach Udhewadi plateau and begin the climb to Shrivardhan Fort (the taller citadel) for 360-degree views of the Sahyadris.
12:30 PM: Descend to the col and explore Manaranjan Fort, inspecting its massive ramparts, water cisterns, and Konkan valley viewpoints.
01:45 PM: Return to Udhewadi village for a hot, home-cooked Maharashtrian lunch.
03:00 PM: Begin descent back to the base vehicle point.
05:00 PM: Freshen up, grab evening tea and snacks, and depart for Pune.
08:00 PM – 08:30 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Private Pune-to-Pune transport (including tolls, parking, and driver allowances)$$,$$Morning hot breakfast and tea$$,$$Authentic home-cooked Maharashtrian village lunch$$,$$Evening tea and snacks en route$$,$$Forest / village entry fees and local permissions$$,$$Experienced withinmiles.in trek leaders and basic first-aid support$$],
 array[$$Personal expenses, packaged drinking water, or cold drinks$$,$$Medical or emergency evacuation expenses$$,$$Anything not mentioned in the inclusions$$],
 array[$$2–3 litres of water (mandatory)$$,$$Good grip trekking or sports shoes (mandatory)$$,$$Rainwear / poncho and dry bag for electronics$$,$$Compact daypack (20–30L)$$,$$Electrolytes, glucose, or light trail snacks$$,$$Original Government Photo ID, personal medication, and an extra pair of clothes$$]),

-- 7. Twin Fort Flower Bloom
($$twin-fort-flower-bloom$$, $$Twin Fort Flower Bloom Trek (Pune to Pune)$$,
 $$Chase seasonal wildflowers across a scenic twin-fort ridge trail overlooking the Krishna valley. Summit two historic forts, discover a hidden waterfall along the connecting trail, enjoy an authentic home-cooked village lunch, and unwind at golden hour by the Dhom Dam backwaters.$$,
 $$Wai / Satara, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1400, null, null,
 $$/images/placeholder-trip.svg$$,
 array[$$Scenic twin-fort ridge traverse with seasonal flower blooms and panoramic valley views$$,$$Discover a hidden waterfall along the connecting trail between the two forts$$,$$Authentic home-cooked Maharashtrian vegetarian lunch at a local village house$$,$$Golden hour sightseeing by the tranquil Dhom Dam backwaters$$,$$Beginner-friendly trail (Easy to Moderate difficulty, Medium endurance) in a small, tight-knit batch$$],
 true, false,
 $$August–October$$, $$Pune (Shivajinagar, Swargate, Katraj Chowk)$$, $$Weekends (Saturday / Sunday departures)$$, null,
 $$Day 1: Pune – Twin Fort Trek – Dhom Dam – Pune
04:00 AM – 05:00 AM: Depart from Pune (Shivajinagar at 04:00 AM, Swargate at 04:30 AM, Katraj Chowk at 05:00 AM).
06:30 AM: Reach base region; enjoy traditional hot breakfast and tea en route.
07:30 AM: Reach base village, freshen up, and attend the trek briefing.
08:15 AM: Trek begins.
09:00 AM: Reach the first summit; take in panoramic valley views and capture photos.
10:30 AM: Begin descending toward the connecting ridge.
11:30 AM: Discover the hidden waterfall and start the trail toward the second fort.
12:30 PM: Reach the second fort; explore its historical architecture, flora, and fauna.
01:30 PM: Relish an authentic home-cooked Maharashtrian vegetarian lunch at a local village home.
03:00 PM: Begin final descent back to the base.
04:00 PM: Reach base village and board the bus.
04:45 PM: Sightseeing at Dhom Dam-unwind by the backwaters and catch the evening golden hour.
05:45 PM: Start return journey toward Pune (with an evening tea break en route).
08:30 PM – 09:15 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Private non-AC transport (Pune to Pune)$$,$$Morning hot breakfast and tea$$,$$Authentic home-cooked local vegetarian lunch$$,$$Evening tea en route$$,$$Fort entry fees and local permissions (if any)$$,$$First-aid kit, safety support, and experienced withinmiles.in trek leaders$$],
 array[$$Personal expenses and packaged drinking water$$,$$Anything not mentioned in the inclusions$$],
 array[$$2–3 litres of water (mandatory)$$,$$Good grip trekking or sports shoes$$,$$Rainwear / poncho and dry bag for electronics$$,$$Small backpack (20–30L)$$,$$Personal medication and an extra pair of clothes$$]),

-- 8. Torna
($$torna-fort$$, $$Torna Fort (Prachandagad) Trek (Pune to Pune)$$,
 $$Conquer the highest hill fort in Pune district-Torna (Prachandagad), the very first fort captured by Chhatrapati Shivaji Maharaj at age 16. Ascend steep ridges and iron-railed rock patches from Velhe village to walk across the sprawling Zunjar Machi and Budhla Machi with panoramic views of Rajgad, Sinhagad, and Bhatghar Dam.$$,
 $$Velhe, Pune, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1700, null, null,
 $$/images/torna-fort.jpg$$,
 array[$$Summit Torna (Prachandagad), the highest fort in Pune district at 1,403 meters (4,603 ft)$$,$$Traverse the dramatic rock-cut ridges of Zunjar Machi and Budhla Machi$$,$$Explore historic landmarks including Bini Darwaza, Kothi Darwaza, Menghai Devi Temple, and Tonjai Temple$$,$$Sweeping panoramic views of Rajgad, Raigad, Lingana, Sinhagad, and Bhatghar Dam backwaters$$,$$Authentic home-cooked Maharashtrian village lunch served at Velhe base village$$],
 true, false,
 $$June–February$$, $$Pune (Shivajinagar, Swargate, Katraj Chowk)$$, $$Every weekend / Flexible$$, null,
 $$Day 1: Pune – Velhe – Torna Fort (Prachandagad) – Pune
04:00 AM – 05:00 AM: Depart from Pune (Shivajinagar at 04:00 AM, Swargate at 04:30 AM, Katraj Chowk at 05:00 AM).
06:30 AM: Traditional hot breakfast and tea en route near Velhe.
07:15 AM: Reach base village Velhe, freshen up, and attend the safety & trek briefing.
07:45 AM: Begin the ascent via the scenic forest ridge and rock-cut steps toward Bini Darwaza.
10:30 AM: Enter Torna through Bini Darwaza and Kothi Darwaza; visit Menghai Devi Temple and explore Budhla Machi.
11:30 AM: Walk the thrilling ridge trail out to Zunjar Machi for dramatic valley viewpoints and photos.
12:45 PM: Begin descent back along the ridge toward Velhe base village.
03:15 PM: Reach Velhe, freshen up, and relish a hot, authentic home-cooked Maharashtrian lunch.
04:30 PM: Board the private bus for the return journey to Pune (with an evening tea break en route).
07:30 PM – 08:00 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Private non-AC transport (Pune to Pune)$$,$$Morning hot breakfast and tea$$,$$Authentic local Maharashtrian village lunch$$,$$Evening tea en route$$,$$Forest / village entry fees and local permissions (if any)$$,$$First-aid kit, safety support, and experienced withinmiles.in trek leaders$$],
 array[$$Personal expenses and packaged drinking water$$,$$Medical or emergency evacuation expenses$$,$$Anything not mentioned in the inclusions$$],
 array[$$3 litres of water (mandatory, steep climb and exposed machis)$$,$$Good grip trekking or sports shoes (mandatory)$$,$$Rainwear / poncho and dry bag for electronics$$,$$Electrolytes, glucose, or light trail snacks$$,$$Compact daypack (20–30L)$$,$$Original Government Photo ID, personal medication, and an extra pair of clothes$$]),

-- 9. Kamalgad
($$kamalgad-fort$$, $$Kamalgad Fort Trek (Pune to Pune)$$,
 $$Rising like a sheer basalt pillar above the Dhom Dam backwaters near Wai, Kamalgad (Bhelanja) is an offbeat, plateau-top fort famed for its dramatic 360-degree views of Mahabaleshwar, Panchgani, and Pandavgad. Ascend through lush forest trails from Vasole village to explore its intriguing Geru (red ochre) cave and deep water cisterns.$$,
 $$Wai / Satara, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1400, null, null,
 $$/images/kamalgad-fort.jpg$$,
 array[$$Offbeat, crowd-free plateau trek rising dramatically above the Dhom Dam backwaters$$,$$Panoramic 360-degree viewpoints overlooking Mahabaleshwar, Panchgani, Pandavgad, Kenjalgad, and Raireshwar$$,$$Explore the unique underground Geru (red ochre) cave and historic rock-cut water tanks$$,$$Scenic forest trail ascent from Vasole base village with a thrilling final rock-step climb$$,$$Authentic home-cooked Maharashtrian village lunch included$$],
 true, false,
 $$June–February$$, $$Pune (Shivajinagar, Swargate, Katraj Chowk)$$, $$Every weekend / Flexible$$, null,
 $$Day 1: Pune – Vasole – Kamalgad Fort – Pune
04:30 AM – 05:30 AM: Depart from Pune (Shivajinagar at 04:30 AM, Swargate at 05:00 AM, Katraj Chowk at 05:30 AM).
07:15 AM: Traditional hot breakfast and tea en route near Wai / Pasarni Ghat.
08:15 AM: Reach base village Vasole, freshen up, and attend the safety & trek briefing.
08:45 AM: Begin the ascent through dense forest trails toward the fort col.
10:45 AM: Climb the final rock-cut steps onto the flat plateau summit of Kamalgad; explore the Geru (red ochre) cave, rock cisterns, and panoramic backwater viewpoints.
12:15 PM: Begin descent back through the forest trail toward Vasole village.
02:00 PM: Reach Vasole base village, freshen up, and relish a hot, home-cooked Maharashtrian lunch.
03:30 PM: Board the private bus for the return journey to Pune (with an evening tea break en route).
07:30 PM – 08:00 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Private non-AC transport (Pune to Pune)$$,$$Morning hot breakfast and tea$$,$$Authentic home-cooked Maharashtrian village lunch$$,$$Evening tea en route$$,$$Forest / village entry fees and local permissions (if any)$$,$$First-aid kit, safety support, and experienced withinmiles.in trek leaders$$],
 array[$$Personal expenses and packaged drinking water$$,$$Medical or emergency evacuation expenses$$,$$Anything not mentioned in the inclusions$$],
 array[$$2–3 litres of water (mandatory)$$,$$Good grip trekking or sports shoes (mandatory)$$,$$Rainwear / poncho and dry bag for electronics$$,$$Compact daypack (20–30L)$$,$$Torch / headlamp (for exploring the Geru cave)$$,$$Electrolytes, glucose, or light trail snacks$$,$$Original Government Photo ID, personal medication, and an extra pair of clothes$$]),

-- 10. Rohida
($$rohida-fort$$, $$Rohida Fort (Vichitragad) Trek (Pune to Pune)$$,
 $$Tucked away in the lush Bhor region south of Pune, Rohida Fort (Vichitragad) is an intact, beginner-friendly hill fort renowned for its three impressive entrance gates, ancient rock-cut water cisterns, and sweeping views of Raireshwar, Kenjalgad, and the Bhatghar Dam backwaters.$$,
 $$Bhor, Pune, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1400, null, null,
 $$/images/placeholder-trip.svg$$,
 array[$$Beginner-to-moderate scenic trek near Bhor with well-preserved stone fortifications and rock-cut steps$$,$$Pass through three historic entrance gates-Ganesh Darwaza, Sadar Darwaza, and Bini Darwaza$$,$$Visit the ancient Rohideshwar Temple, seven rock-cut water cisterns, and bastion viewpoints at the summit$$,$$Panoramic views of Raireshwar plateau, Kenjalgad, Kamalgad, and Bhatghar Dam backwaters$$,$$Authentic home-cooked Maharashtrian village lunch served at Bajarwadi base village$$],
 true, false,
 $$June–February$$, $$Pune (Shivajinagar, Swargate, Katraj Chowk)$$, $$Every weekend / Flexible$$, null,
 $$Day 1: Pune – Bajarwadi – Rohida Fort (Vichitragad) – Pune
05:00 AM – 06:00 AM: Depart from Pune (Shivajinagar at 05:00 AM, Swargate at 05:30 AM, Katraj Chowk at 06:00 AM).
07:15 AM: Traditional hot breakfast and tea en route near Bhor.
08:00 AM: Reach base village Bajarwadi, freshen up, and attend the safety & trek briefing.
08:30 AM: Begin the ascent through forest trails and stone steps toward the fort entrance.
10:15 AM: Enter Rohida through its three historic gates; explore Rohideshwar Temple, rock-cut cisterns, and rampart viewpoints.
11:45 AM: Begin descent back toward Bajarwadi base village.
01:15 PM: Reach Bajarwadi, freshen up, and relish a hot, home-cooked Maharashtrian village lunch.
02:45 PM: Board the private bus for the return journey to Pune (with an evening tea break en route).
05:30 PM – 06:00 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Private non-AC transport (Pune to Pune)$$,$$Morning hot breakfast and tea$$,$$Authentic home-cooked Maharashtrian village lunch$$,$$Evening tea en route$$,$$Forest / village entry fees and local permissions (if any)$$,$$First-aid kit, safety support, and experienced withinmiles.in trek leaders$$],
 array[$$Personal expenses and packaged drinking water$$,$$Medical or emergency evacuation expenses$$,$$Anything not mentioned in the inclusions$$],
 array[$$2–3 litres of water (mandatory)$$,$$Good grip trekking or sports shoes (mandatory)$$,$$Rainwear / poncho and dry bag for electronics$$,$$Compact daypack (20–30L)$$,$$Electrolytes, glucose, or light trail snacks$$,$$Original Government Photo ID, personal medication, and an extra pair of clothes$$]),

-- 11. Pratapgad
($$pratapgad-fort$$, $$Pratapgad Fort Trek & Heritage Trail (Pune to Pune)$$,
 $$Stand where history was forged at Pratapgad-the legendary mountain fortress near Mahabaleshwar, site of the historic 1659 Battle of Pratapgad. Ascend through lush Sahyadri valleys to explore its double fortifications, towering equestrian statue of Chhatrapati Shivaji Maharaj, and sweeping views of the Konkan and Koyna valleys.$$,
 $$Mahabaleshwar / Satara, Maharashtra$$, 'maharashtra', 'trek', 1, 0, 1500, null, null,
 $$/images/pratapgad-fort.jpg$$,
 array[$$Explore the iconic 17th-century hill fortress of Pratapgad, famed for the historic Battle of Pratapgad$$,$$Walk across the Upper Fort (Balekilla) and Lower Fort (Machi) ramparts with panoramic Konkan valley views$$,$$Visit the revered Bhavani Mata Temple, Afzal Buruj, and the bronze equestrian statue of Chhatrapati Shivaji Maharaj$$,$$Scenic ghat drive via Panchgani and Mahabaleshwar with optional strawberry/tableland viewpoints en route$$,$$Authentic home-cooked Maharashtrian lunch served near the base village$$],
 true, false,
 $$June–March$$, $$Pune (Shivajinagar, Swargate, Katraj Chowk)$$, $$Every weekend / Flexible$$, null,
 $$Day 1: Pune – Panchgani / Mahabaleshwar – Pratapgad Fort – Pune
04:00 AM – 05:00 AM: Depart from Pune (Shivajinagar at 04:00 AM, Swargate at 04:30 AM, Katraj Chowk at 05:00 AM).
07:00 AM: Traditional hot breakfast and tea en route near Wai / Panchgani.
08:30 AM: Reach Pratapgad base region (Kumthe / Kumbhroshi), freshen up, and attend the trek & heritage briefing.
09:00 AM: Begin the climb via the stone-step trail and forest pathway leading to the grand Maha Darwaza.
10:30 AM: Explore the Lower Fort (Machi), Bhavani Mata Temple, Afzal Buruj, and ascend to Balekilla (Upper Citadel) for sweeping valley views.
12:30 PM: Begin descent back to the base village.
01:45 PM: Freshen up and enjoy a hot, authentic home-cooked Maharashtrian lunch.
03:15 PM: Board the private bus for the return drive via Mahabaleshwar/Panchgani ghat (with an evening tea break en route).
08:30 PM – 09:00 PM: Reach Pune and drop-off at respective pickup points.$$,
 array[$$Private non-AC transport (Pune to Pune)$$,$$Morning hot breakfast and tea$$,$$Authentic home-cooked Maharashtrian lunch$$,$$Evening tea en route$$,$$Fort entry fees and local permissions (if any)$$,$$First-aid kit, safety support, and experienced withinmiles.in trek leaders$$],
 array[$$Personal expenses, packaged drinking water, or Mahabaleshwar strawberry/shopping purchases$$,$$Medical or emergency evacuation expenses$$,$$Anything not mentioned in the inclusions$$],
 array[$$2–3 litres of water (mandatory)$$,$$Good grip trekking or sports shoes (mandatory)$$,$$Rainwear / poncho and dry bag for electronics$$,$$Compact daypack (20–30L)$$,$$Cap, sunglasses, and light windcheater (breezy at high altitude)$$,$$Original Government Photo ID, personal medication, and an extra pair of clothes$$]),

-- 12. Jivdhan Valley Crossing
($$jivdhan-valley-crossing$$, $$Jivdhan Fort Valley Crossing & Rappelling$$,
 $$Take on an adrenaline-pumping adventure at the historic Jivdhan Fort near Naneghat. Experience a thrilling valley crossing between Jivdhan and the towering Vanarlingi pinnacle along with high-altitude rappelling under the supervision of certified technical experts.$$,
 $$Naneghat / Junnar, Maharashtra$$, 'maharashtra', 'adventure', 1, 0, 3499, null, null,
 $$/images/jivdhan-valley-crossing.jpg$$,
 array[$$Thrilling valley crossing and rappelling experience overlooking the dramatic Naneghat valley$$,$$Conducted by a certified technical team using international-standard harnesses, helmets, and belay gear$$,$$Scenic morning ascent to Jivdhan Fort with views of Vanarlingi pinnacle and surrounding Sahyadri peaks$$,$$Flexible joining options from Pune, Mumbai, or directly at the base village (optional prior-night camping available at ₹600/person)$$,$$Participant criteria: Age 10–65 years, max weight 95 kg, prior rappelling experience (min. 100 ft) required$$],
 true, true,
 $$October–March$$, $$Pune, Mumbai (or direct at Jivdhan base village)$$, $$Every Saturday and Sunday (overnight travel)$$, $$₹3,499 (Pune to Pune / Mumbai to Mumbai) | ₹2,799 (Without Transport, Including Insurance)$$,
 $$Day 1: Overnight Travel – Jivdhan Fort Trek – Valley Crossing & Rappelling – Return
10:00 PM (Previous Night): Overnight journey begins from Pune and Mumbai.
02:00 AM: Pune batch reaches Jivdhan base village and rests until 04:30 AM.
04:00 AM: Mumbai batch reaches Jivdhan base village.
04:30 AM: Freshen up and gear distribution (harness, helmet, and safety equipment).
05:00 AM: Hot morning tea and breakfast.
05:30 AM: Trek begins toward the set-up point at Jivdhan Fort with a group introduction and safety briefing from technical experts.
07:00 AM: Reach the Jivdhan Fort set-up point and begin the Valley Crossing & Rappelling sessions.
Afternoon: Conclude activities, carry dry fruits/snacks for midday energy, and descend to the base village.
Post-Trek: Relish a hot lunch at the base village and depart for Pune and Mumbai.
09:00 PM – 10:00 PM: Reach home with loads of memories (allow a 1–2 hr buffer depending on group pace and traffic).$$,
 array[$$Travelling by private non-AC bus (for Pune-to-Pune and Mumbai-to-Mumbai packages)$$,$$All technical safety equipment (harness, helmet, carabiners, ropes)$$,$$Tea, breakfast, and lunch$$,$$Adventure insurance$$,$$Certified technical team, trek guide, and first-aid support$$],
 array[$$Optional prior-night camping facility with Veg/Non-Veg dinner (available at ₹600 per person for early arrivals)$$,$$Afternoon dry fruits/trail snacks$$,$$Personal expenses and packaged drinking water$$,$$Anything not mentioned in the inclusions$$],
 array[$$Shoes with good grip (mandatory)$$,$$Full-sleeve shirt and full pants (mandatory)$$,$$Minimum 3 liters of water per person (mandatory)$$,$$Torch / headlamp$$,$$Electral / ORS pouch (at least 1)$$,$$Dry fruits / light energy snacks for the afternoon$$,$$Original Government Photo ID and personal medications$$]),

-- 13. AMK
($$amk-expedition$$, $$Alang–Madan–Kulang (AMK) Climbing, Rappelling & Camping$$,
 $$Conquer Maharashtra's most thrilling and demanding triad-Alang, Madan, and Kulang (AMK)-in the Kalsubai range of the Sahyadris. This two-day technical expedition combines high-altitude rock climbing, rappelling, ridge traverses, and mountain camping at 4,825 ft.$$,
 $$Kalsubai Range, Nashik, Maharashtra$$, 'maharashtra', 'adventure', 2, 1, 2699, null, null,
 $$/images/amk-expedition.jpg$$,
 array[$$Summit all three legendary fortresses of the Kalsubai range-Alang, Madan, and Kulang (4,825 ft)$$,$$Technical rock climbing and high-altitude rappelling on Madan Fort supervised by certified experts$$,$$Overnight mountain tent camping with sunset and sunrise views across the Sahyadris$$,$$Hard-grade endurance expedition designed for experienced trekkers (Age 12–50, max weight 95 kg)$$,$$Optional individual drone video shoot add-on available (₹500)$$],
 true, true,
 $$November–March$$, $$Pune (Shivajinagar, Nashik Phata, Bhosari, Chakan), Kasara Railway Station (Mumbai Local connection), or Ambewadi Base Village$$, $$Every Friday Night Departure (Jan–March Batches)$$, $$₹2,699 (Pune to Pune) | ₹2,499 (Kasara to Kasara) | ₹1,999 (Base to Base)$$,
 $$Day 1: Overnight Travel – Ambewadi – Alang Fort – Madan Fort Climb & Camping
Friday Night Departure, Pune: Shivajinagar (09:30 PM), Nashik Phata ST Stand (10:00 PM), Bhosari (10:15 PM), Chakan.
Friday Night Departure, Mumbai: Board 09:30 PM CSMT–Kasara Fast Local (CSMT 09:32 PM, Dadar 09:50 PM, Ghatkopar 10:06 PM, Thane 10:27 PM, Dombivli 10:51 PM, Kalyan 11:03 PM, Kasara ~12:13 AM).
01:30 AM – 01:45 AM: Meet at Kasara Railway Station and depart for Ambewadi base village via pre-booked jeeps.
04:00 AM – 05:00 AM: Reach Ambewadi base village (Mumbai & Pune batches regroup) and rest briefly.
05:30 AM: Hot morning tea and breakfast.
06:00 AM: Trek & safety briefing, followed by ascent toward Alang Fort.
09:00 AM: Reach Alang Fort; explore its caves, water cisterns, and panoramic ramparts.
01:00 PM: Basic local lunch on the trek.
03:00 PM: Technical rock climb up to Madan Fort.
06:00 PM: Watch the sunset and pitch tents for overnight camping on the mountain.
08:00 PM: Hot dinner and rest.

Day 2: Madan Fort Rappelling – Kulang Fort – Return
05:00 AM: Wake-up call.
06:00 AM: Morning tea and breakfast.
07:00 AM: Rappelling descent from Madan Fort and traverse toward Kulang Fort.
12:00 PM: Reach Kulang Fort and explore the citadel.
01:00 PM: Begin final descent from Kulang Fort toward Ambewadi.
04:00 PM: Reach base village and enjoy a hot lunch.
05:00 PM: Start return journey toward Kasara, Mumbai, and Pune.
07:30 PM: Approximate arrival at Kasara Railway Station (onward drop-off to Pune thereafter).$$,
 array[$$Private transport (Pune-to-Pune bus or Kasara-to-Kasara jeep, as per selected package)$$,$$Meals: 2 Breakfasts with Tea, 2 Lunches, and 1 Dinner$$,$$Technical rock climbing and rappelling sessions with all safety equipment$$,$$Mountain tent camping on sharing basis$$,$$Certified technical team, trek guide, and first-aid support$$,$$Forest department entry fees$$],
 array[$$Mumbai local train ticket to and from Kasara$$,$$Optional individual drone video shoot (₹500)$$,$$Personal expenses, packaged drinking water, and trail snacks$$,$$Anything not mentioned in the inclusions$$],
 array[$$3 liters of water (mandatory)$$,$$Trekking shoes with good grip (mandatory)$$,$$30L–60L backpack$$,$$Full-sleeve t-shirts and full-length track pants$$,$$Extra pair of clothes$$,$$Sleeping bag, bedsheet, or shawl for overnight mountain camping$$,$$Torch with extra batteries (compulsory)$$,$$Sunscreen and cap$$,$$Dry fruits, dry snacks, and energy bars$$,$$Original Government ID Proof (Aadhaar or PAN Card, compulsory) and personal medicines$$]),

-- 14. Moroshicha Bhairavgad
($$moroshicha-bhairavgad$$, $$Moroshicha Bhairavgad Climbing & Rappelling$$,
 $$Rising steeply from the Konkan floor near Malshej Ghat at 4,997 feet, Moroshicha Bhairavgad is one of Maharashtra's most thrilling technical fort climbs. Combine steep rock-cut steps, vertical rock climbing, and high-altitude rappelling with sweeping views of Naneghat, Jivdhan, Harishchandragad, and Ajoba.$$,
 $$Malshej Ghat / Thane, Maharashtra$$, 'maharashtra', 'adventure', 1, 0, 1799, null, null,
 $$/images/placeholder-trip.svg$$,
 array[$$Thrilling vertical rock climbing and rappelling on Moroshicha Bhairavgad (4,997 ft)$$,$$Supervised by a certified technical team using professional climbing harnesses, ropes, and helmets$$,$$Panoramic views of Sahyadri giants including Naneghat, Jivdhan, Harishchandragad, and Ajoba$$,$$Difficult-grade Giridurg adventure tailored for thrill-seekers and regular trekkers$$,$$Optional rappelling drone shoot add-on available (₹500)$$],
 true, false,
 $$November–March$$, $$Pune (Shivajinagar, Nashik Phata, Bhosari, Chakan), Mumbai (Dadar, Sion, Thane, Kalyan), or Moroshi Base Village$$, $$Saturday Night Departures (Jan–March Batches)$$, $$₹1,799 (Pune to Pune / Mumbai to Mumbai) | ₹1,199 (Without Transport)$$,
 $$Day 1: Overnight Departure – Moroshi Base Village – Bhairavgad Climbing & Rappelling – Return
Saturday Night Departure, Mumbai: Dadar (10:00 PM), Sion Station Circle (10:15 PM), Teen Hat Naka Thane (11:00 PM), Durgadi Chowk Kalyan (12:00 AM).
Saturday Night Departure, Pune: Bank of Maharashtra Shivajinagar (10:00 PM), Nashik Phata (10:30 PM), Bhosari (10:45 PM), Chakan Main Signal (11:15 PM).
03:00 AM – 04:00 AM: Reach Moroshi base village and rest in the bus.
04:45 AM: Wake-up call and complete morning routines.
05:00 AM: Enjoy hot morning tea and breakfast.
05:15 AM: Trek introduction and group safety briefing.
05:30 AM: Begin the ascent toward Bhairavgad Fort.
07:00 AM: Reach Bhairavgad Machi (plateau), rest briefly, and attend technical gear and safety instructions.
07:30 AM – 09:30 AM: Gear up and conquer the thrilling rock-climbing patch to the fort top under expert guidance.
10:00 AM: Summit Bhairavgad, soak in panoramic Sahyadri views, and proceed to the rappelling point.
10:00 AM – 01:00 PM: Rappelling descent session (participants take turns in batches).$$,
 array[$$Private transport (for Pune-to-Pune and Mumbai-to-Mumbai packages)$$,$$All technical safety equipment (harness, helmet, carabiners, ropes)$$,$$Tea, breakfast, and lunch$$,$$Certified technical team, trek guide, and first-aid support$$],
 array[$$Optional rappelling drone shoot (₹500)$$,$$Personal expenses and packaged drinking water$$,$$Anything not mentioned in the inclusions$$],
 array[$$Shoes with good grip (mandatory)$$,$$Full-sleeve shirt and full pants (mandatory)$$,$$Minimum 3 liters of water per person (mandatory)$$,$$Torch / headlamp$$,$$Electral / ORS pouch (at least 1)$$,$$Dry fruits / light energy snacks$$,$$Original Government Photo ID and personal medications$$])

on conflict (slug) do update set
  title_en = excluded.title_en,
  description_en = excluded.description_en,
  destination = excluded.destination,
  region = excluded.region,
  category = excluded.category,
  duration_days = excluded.duration_days,
  duration_nights = excluded.duration_nights,
  price = excluded.price,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  image_url = excluded.image_url,
  highlights = excluded.highlights,
  is_active = excluded.is_active,
  is_featured = excluded.is_featured,
  best_months = excluded.best_months,
  pickup_points = excluded.pickup_points,
  departure_note = excluded.departure_note,
  price_note = excluded.price_note,
  itinerary = excluded.itinerary,
  includes = excluded.includes,
  excludes = excluded.excludes,
  things_to_carry = excluded.things_to_carry;
