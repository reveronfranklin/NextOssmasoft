import { NextRouter } from 'next/router';

// Map keywords to routes
const COMMAND_ROUTING_MAP: { keywords: string[]; path: string }[] = [
  {
    keywords: [
      'modulo de administracion', 
      'módulo de administración', 
      'ir a administracion', 
      'ir a administración', 
      'administracion', 
      'administración',
      'ir al modulo de administracion',
      'ir al módulo de administración'
    ],
    path: '/apps/adm/ordenPago' // Defaults to Orden Pago
  },
  {
    keywords: ['orden de pago', 'ordenes de pago', 'ordenes de pagos', 'ordenpago'],
    path: '/apps/adm/ordenPago'
  },
  {
    keywords: ['preorden de pago', 'pre orden de pago', 'preordenes de pago', 'preordenpago'],
    path: '/apps/adm/preOrdenPago'
  },
  {
    keywords: ['pagos', 'modulo de pagos', 'módulo de pagos'],
    path: '/apps/adm/pagos'
  },
  {
    keywords: ['solicitud de compromiso', 'compromiso', 'solicitudcompromiso'],
    path: '/apps/adm/solicitudCompromiso'
  },
  {
    keywords: ['presupuesto', 'modulo de presupuesto', 'módulo de presupuesto', 'prevsaldo'],
    path: '/apps/presupuesto/prevsaldo'
  },
  {
    keywords: ['maestro presupuesto', 'lista presupuesto', 'listado presupuesto'],
    path: '/apps/presupuesto/maestro/list'
  },
  {
    keywords: ['nomina', 'historial de nomina', 'historico de nomina', 'rh'],
    path: '/apps/rh/historico'
  },
  {
    keywords: ['conteo de bienes', 'bienes nacionales', 'bm', 'conteo historico', 'conteo histórico'],
    path: '/apps/Bm/BmConteoHistorico'
  },
  {
    keywords: ['placas en cuarentena', 'placas cuarentena', 'cuarentena'],
    path: '/apps/Bm/BmPlacasCuarentena'
  }
];

/**
 * Normalizes a string for keyword matching by removing accents, special characters, and converting to lowercase.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}

/**
 * Resolves a command to a specific path using keyword matching.
 */
export function resolveCommandPath(command: string): string | null {
  const normalizedCommand = normalizeText(command);
  
  for (const entry of COMMAND_ROUTING_MAP) {
    for (const keyword of entry.keywords) {
      const normalizedKeyword = normalizeText(keyword);
      if (normalizedCommand.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedCommand)) {
        return entry.path;
      }
    }
  }
  
return null;
}

/**
 * Attempts to perform a DOM click based on command keywords if a matching button or element is found.
 */
export function executeDOMAction(command: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const normalizedCommand = normalizeText(command);
  
  // Example DOM manipulation: Click on tabs, menus, or buttons if keywords match
  if (normalizedCommand.includes('guardar') || normalizedCommand.includes('registrar')) {
    const buttons = Array.from(document.querySelectorAll('button'));
    const saveBtn = buttons.find(btn => {
      const btnText = normalizeText(btn.textContent || '');
      
return btnText === 'guardar' || btnText === 'registrar' || btnText.includes('guardar');
    });
    if (saveBtn) {
      saveBtn.click();
      
return true;
    }
  }

  if (normalizedCommand.includes('buscar') || normalizedCommand.includes('filtrar')) {
    const buttons = Array.from(document.querySelectorAll('button'));
    const searchBtn = buttons.find(btn => {
      const btnText = normalizeText(btn.textContent || '');
      
return btnText === 'buscar' || btnText === 'filtrar' || btnText.includes('buscar');
    });
    if (searchBtn) {
      searchBtn.click();
      
return true;
    }
  }
  
  // Generic selector fallback: If command looks like CSS selector, we can query and click it
  if (command.startsWith('#') || command.startsWith('.')) {
    try {
      const element = document.querySelector(command) as HTMLElement;
      if (element) {
        element.click();
        
return true;
      }
    } catch (e) {
      console.error('Failed to query selector from command:', command, e);
    }
  }

  return false;
}

/**
 * Selecciona una opción en un componente Autocomplete de Material-UI por su etiqueta y valor.
 */
export function executeAutocompleteAction(labelText: string, optionText: string): boolean {
  if (typeof window === 'undefined') return false;

  const inputs = Array.from(document.querySelectorAll('input'));
  const targetInput = inputs.find(input => {
    const id = input.id.toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    
return id.includes(labelText.toLowerCase()) || id.includes('tipo-nomina') || placeholder.includes(labelText.toLowerCase());
  });

  if (!targetInput) return false;

  targetInput.focus();
  targetInput.click();

  const parent = targetInput.parentElement;
  if (parent) {
    const arrowBtn = parent.querySelector('button[title="Open"]') || parent.querySelector('.MuiAutocomplete-popupIndicator');
    if (arrowBtn) {
      (arrowBtn as HTMLElement).click();
    }
  }

  setTimeout(() => {
    const options = Array.from(document.querySelectorAll('[role="option"], .MuiAutocomplete-option'));
    const targetOption = options.find(opt => {
      const text = (opt.textContent || '').toLowerCase();
      
return text.includes(optionText.toLowerCase());
    }) as HTMLElement;

    if (targetOption) {
      targetOption.click();
      console.log(`Successfully selected option "${optionText}" in Autocomplete.`);
    } else {
      targetInput.value = optionText;
      targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      setTimeout(() => {
        const recheckOptions = Array.from(document.querySelectorAll('[role="option"], .MuiAutocomplete-option'));
        const matchedOption = recheckOptions.find(opt => {
          const text = (opt.textContent || '').toLowerCase();
          
return text.includes(optionText.toLowerCase());
        }) as HTMLElement;
        
        if (matchedOption) {
          matchedOption.click();
        }
      }, 500);
    }
  }, 200);

  return true;
}

/**
 * Main function to execute page actions from the assistant.
 */
export function performPageAction(
  command: string, 
  router: NextRouter, 
  options?: { preventNavigation?: boolean }
): { success: boolean; type: 'route' | 'dom' | 'none'; path?: string; extraData?: any } {
  console.log('Executing performPageAction for command:', command);
  
  const normalizedCommand = normalizeText(command);

  // Detect query for budget selection with a year (e.g. "presupuesto 2025" or "seleccionar presupuesto del año 2025")
  if (normalizedCommand.includes('presupuesto')) {
    const yearMatch = normalizedCommand.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      const year = yearMatch[1];
      const path = '/apps/presupuesto/prevsaldo';

      // If not on the budget balances view, navigate there first
      if (router.pathname !== path) {
        if (options?.preventNavigation) {
          return { 
            success: true, 
            type: 'route', 
            path, 
            extraData: { type: 'autocomplete', label: 'presupuesto', value: year } 
          };
        }
        
        router.push(path);
        
        // Wait for page transition to complete, then select the year in the Autocomplete
        setTimeout(() => {
          executeAutocompleteAction('presupuesto', year);
        }, 1200);

        return { success: true, type: 'route', path };
      } else {
        // If already on the view, execute the Autocomplete selection directly
        const domOk = executeAutocompleteAction('presupuesto', year);
        if (domOk) {
          return { success: true, type: 'dom' };
        }
      }
    }
  }

  // 1. Try DOM action first (e.g. click submit or custom selector if applicable)
  const domSuccess = executeDOMAction(command);
  if (domSuccess) {
    return { success: true, type: 'dom' };
  }

  // 2. Try routing action
  const path = resolveCommandPath(command);
  if (path) {
    if (options?.preventNavigation) {
      return { success: true, type: 'route', path };
    }
    
    router.push(path);
    
    return { success: true, type: 'route', path };
  }

  console.warn('No action could be resolved for command:', command);
  
  return { success: false, type: 'none' };
}
