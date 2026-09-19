import { $ } from '../core/dom.js';
import { on } from '../core/events.js';
import { withBase } from '../core/base-path.js';
import { openDialog, closeDialog } from './dialogs.js';
import { copyText } from './toast.js';
import { t } from './language.js';

export function initDiscord() {
  on(document, 'omar:discord', () => {
    const frame = $('#pageFrame');
    if (frame) frame.src = withBase('pages/discord.html');
    openDialog('pageOverlay');
  });
  on(document, 'click', (event) => {
    if (event.target.closest('#closePageBtn') || event.target.id === 'pageOverlay') {
      closeDialog('pageOverlay');
      const frame = $('#pageFrame');
      if (frame) frame.src = '';
    }
  });
}

export function initDiscordPage() {
  const copyBtn = $('#discordCopyBtn');
  copyBtn?.addEventListener('click', () => copyText('gdmi_3', t('copied')));
}
