import type { InjectionKey } from 'vue';
import type { ComponentProps } from '@/src/types/helpers';
import Datatable from '@/src/runtime/components/datatable.vue'

export type DatatableProps = ComponentProps<typeof Datatable>

export type DatatableDefaults = Partial<DatatableProps>

export const DatatableDefaultsSymbol: InjectionKey<DatatableDefaults> = Symbol('DatatableDefaults');

