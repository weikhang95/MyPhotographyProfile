import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
import { LocaleService } from '../../../i18n/locale.service';

export type GraphicArchetype = 'decoupled' | 'stream' | 'matrix' | 'layers' | 'replies';

@Component({
  selector: 'app-editorial-graphic',
  standalone: true,
  templateUrl: './editorial-graphic.component.html',
  styleUrls: ['./editorial-graphic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorialGraphicComponent {
  readonly localeService = inject(LocaleService, { optional: true });
  readonly isChinese = computed(() => this.localeService?.isChinese() ?? false);
  /**
   * The architectural visual archetype to render:
   * - 'decoupled': Brain & Hands / Separated subsystems with interface bus (Anthropic Managed Agents style)
   * - 'stream': Append-only event logs / Token flow / Sequence pipeline
   * - 'matrix': State graph / Multi-agent routing network / Topological mesh
   * - 'layers': Stack abstractions / Sandbox isolation planes / Virtualization
   * - 'replies': Three LLM reply shapes (talk, fill a form, ask your code to act)
   */
  readonly variant = input<GraphicArchetype>('decoupled');

  /** Optional title or schematic label displayed inside or alongside the graphic */
  readonly label = input<string>('');

  /** Optional caption rendered beneath the graphic */
  readonly caption = input<string>('');

  /** Whether subtle motion/pulse is enabled (respects prefers-reduced-motion automatically) */
  readonly animated = input<boolean>(true);
}
