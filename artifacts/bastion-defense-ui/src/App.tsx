import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, CircleHelp, Coins, Crosshair,
  Crown, Gamepad2, Gem, Globe2, Hammer, Headphones, LockKeyhole, Map,
  Radio, Settings, Shield, ShoppingBag, SlidersHorizontal, Sparkles,
  Swords, Target, Trophy, Volume2, Zap, Gift,
} from 'lucide-react';

export type BastionUiAdapter = {
  onLaunchCampaign?: (campaignId: string) => void;
  onUpgradeDefense?: (defenseId: string) => void;
  onPurchase?: (sku: string) => void;
  onSfxVolumeChange?: (volume: number) => void;
};

export const bastionUiAdapter: BastionUiAdapter = {};

// Replace these safe, named slots with production art without touching screen layout.
export const assetSlots = {
  mainMenuBackground: 'main_menu_background.png',
  logo: 'bastion-defense-logo.png',
  campaignBackgrounds: ['campaign_01_background.png', 'campaign_02_background.png', 'campaign_03_background.png', 'campaign_04_background.png', 'campaign_05_background.png'],
  defenseArt: ['store_defense_twin_cannon.png', 'store_defense_ballista.png', 'store_defense_arc_lens.png'],
  goldPackages: ['gold_package_small.png', 'gold_package_medium.png', 'gold_package_large.png', 'gold_package_mega.png'],
  diamondPackages: ['diamond_package_small.png', 'diamond_package_medium.png', 'diamond_package_large.png', 'diamond_package_mega.png'],
  specialOffers: ['special_offer_01.png', 'special_offer_02.png', 'special_offer_03.png', 'special_offer_04.png'],
} as const;

type Screen = 'home' | 'campaign' | 'store' | 'sound' | 'settings' | 'stub1' | 'stub2' | 'stub3';
type StoreTab = 'defenses' | 'gold' | 'diamonds' | 'offers';

function AssetLayer({ slot, className = '', alt = '' }: { slot: string; className?: string; alt?: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <img
      className={`asset-layer ${className}`}
      src={`${import.meta.env.BASE_URL}assets/${slot}`}
      alt={alt}
      onError={() => setVisible(false)}
    />
  );
}

const campaigns = [
  { id: 'iron-pass', number: '01', name: 'IRON PASS', description: 'A sunny mountain trail with one very brave gate to protect.', progress: 100, stage: '12 / 12', unlocked: true },
  { id: 'ember-coast', number: '02', name: 'EMBER COAST', description: 'The tide is rising. Rally your towers before the shore comes alive.', progress: 42, stage: '05 / 12', unlocked: true },
  { id: 'glass-marsh', number: '03', name: 'GLASS MARSH', description: 'A misty maze full of surprises. Finish the coast to unlock it.', progress: 0, stage: 'LOCKED', unlocked: false },
  { id: 'northwatch', number: '04', name: 'NORTHWATCH', description: 'A snowy frontier waiting for its next great defender.', progress: 0, stage: 'LOCKED', unlocked: false },
  { id: 'sunken-yard', number: '05', name: 'SUNKEN YARD', description: 'Old machines are waking up beneath the wreckage.', progress: 0, stage: 'LOCKED', unlocked: false },
];

const defenses = [
  { id: 'twin-cannon', name: 'TWIN CANNON', rarity: 'UNCOMMON', description: 'A rapid-fire twin barrel defense for swarms and light targets.', damage: '28', range: '250', fireRate: '0.70 /s', cost: '180', bars: [62, 74, 48, 36] },
  { id: 'ballista', name: 'BALLISTA', rarity: 'RARE', description: 'A patient siege bow that punches through armored lanes.', damage: '74', range: '320', fireRate: '0.28 /s', cost: '420', bars: [86, 88, 28, 52] },
  { id: 'arc-lens', name: 'ARC LENS', rarity: 'EPIC', description: 'A focused beam defense that chains between nearby targets.', damage: '51', range: '280', fireRate: '1.10 /s', cost: '680', bars: [72, 78, 68, 66] },
];

const currencyPackages = {
  gold: [
    { id: 'gold-scout', label: 'SCOUT', amount: '1,200', price: '$1.29', bonus: 'FIELD RATIONS' },
    { id: 'gold-forge', label: 'FORGE', amount: '6,500', price: '$4.99', bonus: '+500 BONUS' },
    { id: 'gold-arsenal', label: 'ARSENAL', amount: '18,000', price: '$9.99', bonus: '+2,000 BONUS', featured: true },
    { id: 'gold-citadel', label: 'CITADEL', amount: '52,000', price: '$19.99', bonus: '+8,000 BONUS' },
  ],
  diamonds: [
    { id: 'diamond-spark', label: 'SPARK', amount: '80', price: '$1.29', bonus: 'FIRST DROP' },
    { id: 'diamond-cluster', label: 'CLUSTER', amount: '450', price: '$4.99', bonus: '+35 BONUS' },
    { id: 'diamond-vein', label: 'VEIN', amount: '1,250', price: '$9.99', bonus: '+150 BONUS', featured: true },
    { id: 'diamond-core', label: 'CORE', amount: '3,800', price: '$19.99', bonus: '+500 BONUS' },
  ],
};

const offers = [
  { title: 'DAWN PATROL', description: 'A clean start for the next push.', reward: '2,400 GOLD  +  60 DIAMONDS', price: '$2.49', badge: 'LIMITED', color: '#2bbfc0', index: '01' },
  { title: 'IRON RESERVE', description: 'Blueprints for a stronger frontline.', reward: 'BALLISTA BLUEPRINT  +  900 GOLD', price: '$5.49', badge: 'BEST VALUE', color: '#e87855', index: '02' },
  { title: 'NIGHT WATCH', description: 'See the dark lanes before they move.', reward: 'ARC LENS SHARD  +  120 DIAMONDS', price: '$7.99', badge: 'NEW', color: '#8b79d6', index: '03' },
  { title: 'COMMANDER KIT', description: 'Everything needed to hold one more wave.', reward: '4,800 GOLD  +  300 DIAMONDS', price: '$12.99', badge: 'HOT', color: '#d5a342', index: '04' },
];

function useToastMessage() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [message]);
  return { message, show: setMessage };
}

function TopBar({ onHome }: { onHome: () => void }) {
  return (
    <header className="topbar">
      <button className="brand-mark" onClick={onHome} data-testid="button-home">
        <span className="brand-shield"><Shield size={18} /></span>
        <span><span className="brand-name">BASTION <span>DEFENSE</span></span><small className="brand-subtitle">THE LAST STRONGHOLD</small></span>
      </button>
      <div className="resource-bar" aria-label="sample resources">
        <div className="resource" data-testid="text-gold-balance"><Coins size={16} /><span className="mono">GOLD</span><b>14,280</b></div>
        <div className="resource diamond" data-testid="text-diamond-balance"><Gem size={16} /><span className="mono">DIAMONDS</span><b>480</b></div>
        <div className="player-pill"><span className="player-avatar"><Shield size={14} /></span><span><b>COMMANDER</b><small>LEVEL 08</small></span></div>
      </div>
    </header>
  );
}

function BackButton({ onClick, label = 'Main Menu' }: { onClick: () => void; label?: string }) {
  return <button className="back-button" onClick={onClick} data-testid="button-back"><ArrowLeft size={17} /> {label}</button>;
}

function MainMenu({ go, show }: { go: (screen: Screen) => void; show: (message: string) => void }) {
  const left = [
    { label: 'Shop', icon: <ShoppingBag size={20} />, screen: 'store' as Screen },
    { label: 'Audio', icon: <Volume2 size={20} />, screen: 'sound' as Screen },
  ];
  const right = [
    { label: 'Settings', icon: <Settings size={20} />, screen: 'settings' as Screen },
    { label: 'Ranks', icon: <Trophy size={20} />, screen: 'stub1' as Screen },
    { label: 'Events', icon: <Map size={20} />, screen: 'stub2' as Screen },
    { label: 'Allies', icon: <Radio size={20} />, screen: 'stub3' as Screen },
  ];
  const navigation = (screen: Screen) => { go(screen); show(`Opening ${screen === 'store' ? 'armory' : screen}`); };
  return (
    <div className="screen">
      <AssetLayer slot={assetSlots.mainMenuBackground} className="home-art" />
      <TopBar onHome={() => go('home')} />
      <div className="nav-column left">
        {left.map(item => <button className="nav-button" key={item.label} title={item.label} aria-label={item.label} onClick={() => navigation(item.screen)} data-testid={`button-${item.label.toLowerCase()}`}>{item.icon}<span>{item.label}</span></button>)}
      </div>
      <div className="nav-column right">
        {right.map(item => <button className="nav-button" key={item.label} title={item.label} aria-label={item.label} onClick={() => navigation(item.screen)} data-testid={`button-${item.label.toLowerCase().replace(' ', '-')}`}>{item.icon}<span>{item.label}</span></button>)}
      </div>
      <main className="home-center" data-asset-slot={assetSlots.mainMenuBackground}>
        <div className="hero-copy-block">
          <AssetLayer slot={assetSlots.logo} className="main-menu-logo" alt="Bastion Defense" />
          <div className="eyebrow hero-kicker">WELCOME BACK, COMMANDER</div>
          <h1 className="display hero-title">Defend <span>the Wall</span></h1>
          <p className="hero-copy">The kingdom is counting on you. Build brave defenses and stop the next wave.</p>
          <button className="game-button primary" onClick={() => go('campaign')} data-testid="button-play"><Swords size={24} /> PLAY NOW</button>
          <div className="hero-reward"><Gift size={16} /><span>First win today</span><b>+250 GOLD</b></div>
        </div>
        <div className="hero-character" aria-hidden="true"><span className="character-shadow" /><span className="character-cape" /><span className="character-body" /><span className="character-head"><i /><i /></span><span className="character-shield"><Shield size={44} /></span><span className="character-spark spark-one" /><span className="character-spark spark-two" /></div>
      </main>
      <div className="corner-label">A NEW ADVENTURE AWAITS</div>
    </div>
  );
}

function CampaignSelect({ go, show }: { go: (screen: Screen) => void; show: (message: string) => void }) {
  const [active, setActive] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(typeof window === 'undefined' ? 900 : window.innerWidth);
  const pointerStart = useRef<number | null>(null);
  useEffect(() => {
    const resize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  const cardWidth = Math.min(viewportWidth * .66, 690);
  const gap = Math.max(12, viewportWidth * .02);
  const transform = viewportWidth / 2 - cardWidth / 2 - active * (cardWidth + gap);
  const shift = (direction: number) => setActive(current => Math.max(0, Math.min(campaigns.length - 1, current + direction)));
  const selected = campaigns[active];
  return (
    <div className="screen">
      <TopBar onHome={() => go('home')} />
      <div className="inner-screen">
        <div className="screen-heading">
          <div><div className="eyebrow">YOUR KINGDOM // CHOOSE A WORLD</div><h1 className="display screen-title">Choose <span>your adventure</span></h1></div>
          <BackButton onClick={() => go('home')} />
        </div>
        <div className="carousel-shell">
          <button className="carousel-arrow left" onClick={() => shift(-1)} aria-label="Previous campaign" data-testid="button-previous-campaign"><ChevronLeft size={28} /></button>
          <div className="carousel-viewport"
            role="listbox"
            tabIndex={0}
            aria-label="Campaign worlds"
            onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => { pointerStart.current = event.clientX; }}
            onPointerUp={(event: ReactPointerEvent<HTMLDivElement>) => { if (pointerStart.current === null) return; const distance = event.clientX - pointerStart.current; if (Math.abs(distance) > 36) shift(distance < 0 ? 1 : -1); pointerStart.current = null; }}
            onPointerCancel={() => { pointerStart.current = null; }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') { event.preventDefault(); shift(-1); }
              if (event.key === 'ArrowRight') { event.preventDefault(); shift(1); }
              if (event.key === 'Home') { event.preventDefault(); setActive(0); }
              if (event.key === 'End') { event.preventDefault(); setActive(campaigns.length - 1); }
            }}
            data-testid="carousel-campaigns">
            <div className="carousel-track" style={{ transform: `translateX(${transform}px)` }}>
              {campaigns.map((campaign, index) => (
                <article key={campaign.id} className={`campaign-card ${index === active ? 'active' : ''}`} role="option" aria-selected={index === active} onClick={() => setActive(index)} data-testid={`card-campaign-${campaign.id}`}>
                  <div className="campaign-art" data-asset-slot={assetSlots.campaignBackgrounds[index]}>
                    <AssetLayer slot={assetSlots.campaignBackgrounds[index]} />
                  </div>
                  <div className="campaign-content">
                    <div className="campaign-number">WORLD {campaign.number}</div>
                    <h2 className="display campaign-name">{campaign.name}</h2>
                    <p className="campaign-desc">{campaign.description}</p>
                    <div className="campaign-meta">
                      {campaign.unlocked ? <><span className="mono" style={{ color: 'var(--cream)', fontSize: 11 }}>LEVEL {campaign.stage}</span><span className="progress-line"><i style={{ width: `${campaign.progress}%` }} /></span></> : <span className="locked-mark"><LockKeyhole size={14} /> Finish World 02</span>}
                      {index === active && <button className="game-button secondary" onClick={(event) => { event.stopPropagation(); campaign.unlocked ? (bastionUiAdapter.onLaunchCampaign?.(campaign.id), show(`Starting ${campaign.name}`)) : show('Finish the previous world to unlock this one'); }} data-testid={`button-enter-${campaign.id}`}>{campaign.unlocked ? 'Play' : 'Locked'}</button>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <button className="carousel-arrow right" onClick={() => shift(1)} aria-label="Next campaign" data-testid="button-next-campaign"><ChevronRight size={28} /></button>
          <div className="dots">{campaigns.map((campaign, index) => <button key={campaign.id} className={`dot ${index === active ? 'active' : ''}`} onClick={() => setActive(index)} aria-label={`Select campaign ${index + 1}`} data-testid={`button-dot-${campaign.number}`} />)}</div>
        </div>
      </div>
    </div>
  );
}

function Store({ go, show }: { go: (screen: Screen) => void; show: (message: string) => void }) {
  const [tab, setTab] = useState<StoreTab>('defenses');
  return (
    <div className="screen">
      <TopBar onHome={() => go('home')} />
      <div className="inner-screen">
        <div className="screen-heading">
          <div><div className="eyebrow">A LITTLE SOMETHING FOR YOUR TOWERS</div><h1 className="display screen-title">Treasure <span>Shop</span></h1></div>
          <BackButton onClick={() => go('home')} />
        </div>
       <div className="store-layout">
         <div className="store-intro"><span>Make your defenses stronger</span><small>Choose a boost for your next run.</small></div>
          <nav className="store-tabs" aria-label="Store categories">
            {([['defenses', 'Defenses', <Shield size={16} />], ['gold', 'Gold', <Coins size={16} />], ['diamonds', 'Diamonds', <Gem size={16} />], ['offers', 'Special Offers', <Gift size={16} />] ] as [StoreTab, string, ReactNode][]).map(([id, label, icon]) => <button key={id} className={`store-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)} data-testid={`tab-store-${id}`}>{icon} {label}</button>)}
          </nav>
          <div className="store-content">
            {tab === 'defenses' && <DefenseStore show={show} />}
            {(tab === 'gold' || tab === 'diamonds') && <CurrencyStore type={tab} show={show} />}
            {tab === 'offers' && <Offers show={show} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function DefenseStore({ show }: { show: (message: string) => void }) {
  const [active, setActive] = useState(0);
  const defense = defenses[active];
  const shift = (direction: number) => setActive(current => (current + direction + defenses.length) % defenses.length);
  const statIcons = [<Zap size={16} />, <Target size={16} />, <Crosshair size={16} />, <Coins size={16} />];
  const statNames = ['DAMAGE', 'RANGE', 'FIRE RATE', 'UPGRADING COST'];
  const values = [defense.damage, defense.range, defense.fireRate, defense.cost];
  return (
    <div className="defense-layout">
      <section className="defense-showcase">
        <div className="defense-hero">
          <div className="defense-title"><div className="rarity">{defense.rarity} · LEVEL 04</div><h2 className="display">{defense.name}</h2><p>{defense.description}</p><span className="defense-hint">Ready for an upgrade?</span></div>
          <div className="tower-orb" aria-label={`${defense.name} asset placeholder`} data-asset-slot={assetSlots.defenseArt[active]} data-testid="asset-defense-artwork">
            <AssetLayer slot={assetSlots.defenseArt[active]} alt={`${defense.name} artwork`} />
          </div>
        </div>
        <div className="defense-rail">
          <button className="rail-arrow" onClick={() => shift(-1)} aria-label="Previous defense" data-testid="button-previous-defense"><ChevronLeft size={22} /></button>
          {defenses.map((item, index) => <button className={`defense-thumb ${index === active ? 'active' : ''}`} key={item.id} onClick={() => setActive(index)} data-testid={`button-defense-${item.id}`}><span className="mini-tower" /><span>{item.name}</span></button>)}
          <button className="rail-arrow" onClick={() => shift(1)} aria-label="Next defense" data-testid="button-next-defense"><ChevronRight size={22} /></button>
        </div>
      </section>
      <aside className="stats-panel">
         <h3 className="display">Make it stronger</h3>
        {statNames.map((name, index) => <div className="stat" key={name}><div className="stat-head"><span>{statIcons[index]} {name}</span><b>{values[index]}</b></div><div className="stat-bar"><i style={{ width: `${defense.bars[index]}%` }} /></div></div>)}
        <button className="game-button secondary upgrade-button" onClick={() => { bastionUiAdapter.onUpgradeDefense?.(defense.id); show(`${defense.name} upgrade requested`); }} data-testid="button-upgrade-defense"><Hammer size={18} /> Upgrade <Coins size={16} /> {defense.cost}</button>
      </aside>
    </div>
  );
}

function CurrencyStore({ type, show }: { type: 'gold' | 'diamonds'; show: (message: string) => void }) {
  const isGold = type === 'gold';
  const packages = currencyPackages[type];
  return (
    <>
       <div className="store-kicker"><div><div className="eyebrow">{isGold ? 'SHINY REWARDS FOR BIG UPGRADES' : 'SPARKLE YOUR WAY TO VICTORY'}</div><h2 className="display">{isGold ? 'Gold for your towers' : 'Diamonds for a boost'}</h2></div><p className="mono">{isGold ? '14,280' : '480'} READY</p></div>
      <div className="package-grid">
        {packages.map((pack, index) => <article className={`package-card ${pack.featured ? 'featured' : ''}`} key={pack.id} data-testid={`card-package-${pack.id}`}>
          {pack.featured && <span className="best-badge">BEST VALUE</span>}
          <div className="pack-label">{pack.label}</div>
          <div className={`currency-art ${isGold ? '' : 'diamond'}`}>
            <AssetLayer slot={isGold ? assetSlots.goldPackages[index] : assetSlots.diamondPackages[index]} alt="" />
            {isGold ? <Coins size={48} /> : <Gem size={48} />}
          </div>
          <div className="pack-amount">{pack.amount} <span style={{ fontSize: '.52em', color: isGold ? 'var(--gold)' : 'var(--teal)' }}>{isGold ? 'GOLD' : 'DIAMONDS'}</span></div>
          <div className="pack-bonus">{pack.bonus}</div>
          <button className="game-button secondary buy-button" onClick={() => { bastionUiAdapter.onPurchase?.(pack.id); show(`${pack.label} supply drop selected`); }} data-testid={`button-buy-${pack.id}`}>BUY · {pack.price}</button>
        </article>)}
      </div>
    </>
  );
}

function Offers({ show }: { show: (message: string) => void }) {
  return (
    <div className="offers-grid">
      {offers.map((offer, index) => <article className="offer-card" data-index={offer.index} style={{ '--offer-color': offer.color } as CSSProperties} key={offer.index} data-testid={`card-offer-${offer.index}`}>
        <AssetLayer slot={assetSlots.specialOffers[index]} className="offer-art-image" alt="" />
        <div className="offer-info"><div className="eyebrow" style={{ color: offer.color }}>OFFER {offer.index}</div><h3 className="display">{offer.title}</h3><p>{offer.description}</p><div className="offer-reward">{offer.reward}</div></div>
        <div className="offer-cta"><span className="offer-badge">{offer.badge}</span><button className="game-button" onClick={() => { bastionUiAdapter.onPurchase?.(`offer-${offer.index}`); show(`${offer.title} added to briefing`); }} data-testid={`button-get-offer-${offer.index}`}>GET · {offer.price}</button></div>
      </article>)}
    </div>
  );
}

function Sound({ go, show }: { go: (screen: Screen) => void; show: (message: string) => void }) {
  const [volume, setVolume] = useState(72);
  const changeVolume = (value: number) => { setVolume(value); bastionUiAdapter.onSfxVolumeChange?.(value); };
  return <div className="screen"><TopBar onHome={() => go('home')} /><div className="inner-screen"><BackButton onClick={() => go('home')} /><section className="utility-panel"><div className="eyebrow">MAKE EVERY HIT COUNT</div><h2 className="display">Sound <span style={{ color: 'var(--gold)' }}>effects</span></h2><p>Turn up the clang of the cannons, the cheers of your kingdom, and every satisfying victory.</p><div className="sound-row"><Volume2 size={24} /><input className="sound-slider" type="range" min="0" max="100" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} aria-label="SFX volume" data-testid="input-sfx-volume" /><span className="sound-value" data-testid="text-sfx-volume">{volume}%</span></div><div className="mono asset-note">{volume === 0 ? 'SOUND OFF' : 'SOUND ON'} · SFX VOLUME</div><div className="utility-actions"><button className="game-button secondary" onClick={() => show(`SFX volume set to ${volume}%`)} data-testid="button-test-sfx"><Headphones size={17} /> Test sound</button></div></section></div></div>;
}

function SettingsScreen({ go, show }: { go: (screen: Screen) => void; show: (message: string) => void }) {
  const [hints, setHints] = useState(true);
  const rows: { name: string; description: string; icon: ReactNode; enabled: boolean; onToggle: () => void; opensSound?: boolean }[] = [
    { name: 'Audio', description: 'SFX volume and music bus', icon: <Volume2 size={18} />, enabled: true, onToggle: () => go('sound'), opensSound: true },
    { name: 'Controls', description: 'Landscape touch layout', icon: <Gamepad2 size={18} />, enabled: hints, onToggle: () => setHints(value => !value) },
    { name: 'Language', description: 'English · ready for localization', icon: <Globe2 size={18} />, enabled: true, onToggle: () => show('Language selector is ready for integration') },
    { name: 'Help & Support', description: 'Build notes and controls', icon: <CircleHelp size={18} />, enabled: true, onToggle: () => show('Support surface opened') },
  ];
  return <div className="screen"><TopBar onHome={() => go('home')} /><div className="inner-screen"><BackButton onClick={() => go('home')} /><section className="utility-panel"><div className="eyebrow">MAKE THE KINGDOM YOURS</div><h2 className="display">Settings</h2><p className="utility-lede">Small choices, smoother adventures. Set up Bastion Defense just the way you like it.</p><div className="settings-list">{rows.map((row) => <div className="setting-row" key={row.name}><span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{row.icon}<span><b>{row.name}</b><br /><small>{row.description}</small></span></span><button className={`toggle ${row.enabled ? 'on' : ''}`} onClick={row.onToggle} aria-label={`${row.opensSound ? 'Open' : 'Toggle'} ${row.name}`} data-testid={`button-setting-${row.name.toLowerCase().replace(/ & /g, '-')}`}><i /></button></div>)}</div><div className="utility-actions"><button className="game-button ghost" onClick={() => show('Settings saved locally')} data-testid="button-save-settings"><SlidersHorizontal size={16} /> Save settings</button></div></section></div></div>;
}

function FutureStub({ go, kind }: { go: (screen: Screen) => void; kind: 1 | 2 | 3 }) {
  const data = {
    1: { title: 'COMMANDER RANKS', icon: <Crown size={34} />, description: 'A future home for medals, milestones, and the stories behind every held line.' },
    2: { title: 'TACTICAL INTEL', icon: <Radio size={34} />, description: 'A future briefing room for event rotations, daily orders, and signal reports.' },
    3: { title: 'ALLY NETWORK', icon: <Sparkles size={34} />, description: 'A future place to connect with other commanders and compare fortifications.' },
  }[kind];
  return <div className="screen"><TopBar onHome={() => go('home')} /><div className="inner-screen"><BackButton onClick={() => go('home')} /><section className="utility-panel"><div className="eyebrow">CLASSIFIED MODULE // FEATURE SLOT {kind}</div><div style={{ color: 'var(--gold)', marginTop: 20 }}>{data.icon}</div><h2 className="display">{data.title}</h2><p>{data.description}</p><div className="eyebrow" style={{ marginTop: 24, color: 'var(--muted-foreground)' }}>FEATURE COMING SOON · UI BOUNDARY READY</div><div className="utility-actions"><button className="game-button secondary" onClick={() => go('home')} data-testid={`button-return-stub-${kind}`}><ArrowLeft size={17} /> Return to command</button></div></section></div></div>;
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const toast = useToastMessage();
  const go = (next: Screen) => setScreen(next);
  return <div className="game-app">{screen === 'home' && <MainMenu go={go} show={toast.show} />}{screen === 'campaign' && <CampaignSelect go={go} show={toast.show} />}{screen === 'store' && <Store go={go} show={toast.show} />}{screen === 'sound' && <Sound go={go} show={toast.show} />}{screen === 'settings' && <SettingsScreen go={go} show={toast.show} />}{screen === 'stub1' && <FutureStub go={go} kind={1} />}{screen === 'stub2' && <FutureStub go={go} kind={2} />}{screen === 'stub3' && <FutureStub go={go} kind={3} />}{toast.message && <div className="toast" role="status" data-testid="status-toast">{toast.message}</div>}</div>;
}

export default App;