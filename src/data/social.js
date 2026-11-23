const SOCIAL_ICON_ROOT = 'https://raw.githubusercontent.com/Omar-i9/omar-i9/main/assets/icons/social';
const GAMING_ICON_ROOT = 'https://raw.githubusercontent.com/Omar-i9/omar-i9/main/assets/icons/gaming';

// Links and handles are taken from Omar-i9/omar-i9:data/social.js.
export const socialLinks = [
  { id: 'instagram', name: 'Instagram', handle: 'omar.a.z3', url: 'https://www.instagram.com/omar.a.z3', icon: `${SOCIAL_ICON_ROOT}/instagram.svg` },
  { id: 'snapchat', name: 'Snapchat', handle: 'omar-gdmi', url: 'https://www.snapchat.com/add/omar-gdmi', icon: `${SOCIAL_ICON_ROOT}/snapchat.svg` },
  { id: 'github', name: 'GitHub', handle: 'Omar-i9', url: 'https://github.com/Omar-i9', icon: `${SOCIAL_ICON_ROOT}/github.svg` },
  { id: 'tiktok', name: 'TikTok', handle: 'gdmii_33', url: 'https://www.tiktok.com/@gdmii_33', icon: `${SOCIAL_ICON_ROOT}/tiktok.svg` },
  { id: 'discord', name: 'Discord', handle: 'gdmi_3', copy: 'gdmi_3', icon: `${SOCIAL_ICON_ROOT}/discord.svg` },
  { id: 'facebook', name: 'Facebook', handle: '3mar.a.z3', url: 'https://www.facebook.com/3mar.a.z3', icon: `${SOCIAL_ICON_ROOT}/facebook.svg` },
  { id: 'chess', name: 'Chess.com', handle: 'omar-g4', url: 'https://www.chess.com/member/omar-g4', icon: `${SOCIAL_ICON_ROOT}/chessdotcom.svg` },
  { id: 'steam', name: 'Steam', handle: 'omar_gg33', url: 'https://steamcommunity.com/id/omar_gg33/', icon: `${SOCIAL_ICON_ROOT}/steam.svg` },
  { id: 'spotify', name: 'Spotify', handle: 'Omar', url: 'https://open.spotify.com/user/31zq4egkwu5qt6armgjuvey2tgga', icon: `${SOCIAL_ICON_ROOT}/spotify.svg` },
  { id: 'rockstar', name: 'Rockstar Games', handle: 'Omar-G4', url: 'https://socialclub.rockstargames.com/member/Omar-G4/games', icon: `${SOCIAL_ICON_ROOT}/rockstar-games.svg` },
  { id: 'itch', name: 'itch.io', handle: 'Omar', url: 'https://omar-gx4.itch.io/', icon: `${SOCIAL_ICON_ROOT}/itch.svg` },
  { id: 'linkedin', name: 'LinkedIn', handle: 'omar-abuzeineh-235877439', url: 'https://www.linkedin.com/in/omar-abuzeineh-235877439/', icon: `${SOCIAL_ICON_ROOT}/linkedin.svg` },
  { id: 'nexusmods', name: 'Nexus Mods', handle: 'gdmi33', url: 'https://www.nexusmods.com/profile/gdmi33', icon: `${SOCIAL_ICON_ROOT}/NexusMods.svg` },
  { id: 'pinterest', name: 'Pinterest', handle: 'gdmi33', url: 'https://de.pinterest.com/omargdmi/', icon: `${SOCIAL_ICON_ROOT}/Pinterest.svg` },
  { id: 'twitch', name: 'Twitch', handle: 'omar_gdmi', url: 'https://www.twitch.tv/gdmi3', icon: `${SOCIAL_ICON_ROOT}/twitch.svg` }
];

// Gaming IDs are retained from the same source repository as copyable identifiers.
export const gamingIdentifiers = [
  { id: 'steam-friend', name: 'Steam Friend Code', value: '1586913441', icon: `${GAMING_ICON_ROOT}/steam.svg` },
  { id: 'epic', name: 'Epic Games', value: 'Omar-G4', icon: `${GAMING_ICON_ROOT}/epicgames.svg` },
  { id: 'ubisoft', name: 'Ubisoft', value: 'Omar-G4', icon: `${GAMING_ICON_ROOT}/ubisoft.svg` },
  { id: 'ea', name: 'EA', value: 'gdmi3', icon: `${GAMING_ICON_ROOT}/ea.svg` },
  { id: 'playstation', name: 'PlayStation', value: 'omar-gdmi', icon: `${GAMING_ICON_ROOT}/Playstation.svg` },
  { id: 'tlauncher', name: 'TLauncher', value: 'Omar_GDMi3', icon: `${GAMING_ICON_ROOT}/tlauncher.svg` }
];

export const footerSocials = ['instagram', 'snapchat', 'github'].map((id) => socialLinks.find((item) => item.id === id));
