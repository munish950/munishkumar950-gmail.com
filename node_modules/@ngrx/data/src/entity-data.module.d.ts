import { ModuleWithProviders } from '@angular/core';
import { EffectSources } from '@ngrx/effects';
import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityEffects } from './effects/entity-effects';
import { EntityDataModuleConfig } from './entity-data-without-effects.module';
/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from './entity-data-without-effects.module';
import * as ɵngcc2 from '@ngrx/effects';
export declare class EntityDataModule {
    private effectSources;
    static forRoot(config: EntityDataModuleConfig): ModuleWithProviders<EntityDataModule>;
    constructor(effectSources: EffectSources, entityCacheEffects: EntityCacheEffects, entityEffects: EntityEffects);
    /**
     * Add another class instance that contains @Effect methods.
     * @param effectSourceInstance a class instance that implements effects.
     * Warning: undocumented @ngrx/effects API
     */
    addEffects(effectSourceInstance: any): void;
    static ɵmod: ɵngcc0.ɵɵNgModuleDefWithMeta<EntityDataModule, never, [typeof ɵngcc1.EntityDataModuleWithoutEffects, typeof ɵngcc2.EffectsModule], never>;
    static ɵinj: ɵngcc0.ɵɵInjectorDef<EntityDataModule>;
}

//# sourceMappingURL=entity-data.module.d.ts.map