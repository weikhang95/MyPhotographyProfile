import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type GraphicArchetype = 'decoupled' | 'stream' | 'matrix' | 'layers';

@Component({
  selector: 'app-editorial-graphic',
  standalone: true,
  templateUrl: './editorial-graphic.component.html',
  styleUrls: ['./editorial-graphic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorialGraphicComponent {
  /**
   * The architectural visual archetype to render:
   * - 'decoupled': Brain & Hands / Separated subsystems with interface bus (Anthropic Managed Agents style)
   * - 'stream': Append-only event logs / Token flow / Sequence pipeline
   * - 'matrix': State graph / Multi-agent routing network / Topological mesh
   * - 'layers': Stack abstractions / Sandbox isolation planes / Virtualization
   */
  readonly variant = input<GraphicArchetype>('decoupled');

  /** Optional title or schematic label displayed inside or alongside the graphic */
  readonly label = input<string>('');

  /** Optional caption rendered beneath the graphic */
  readonly caption = input<string>('');

  /** Whether subtle motion/pulse is enabled (respects prefers-reduced-motion automatically) */
  readonly animated = input<boolean>(true);
}
