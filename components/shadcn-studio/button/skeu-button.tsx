"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Info, Bot, Star, Award, CheckCircle2, AlertTriangle } from "lucide-react"

export interface SkeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ai-blue' | 'secondary' | 'peach'
  isDeckle?: boolean
}

export const SkeuButton = React.forwardRef<HTMLButtonElement, SkeuButtonProps>(
  ({ className, variant = 'primary', isDeckle = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-6 py-3 font-semibold btn-interactive transition-all duration-200 text-center flex items-center justify-center gap-2",
          variant === 'primary' && "btn-primary",
          variant === 'ai-blue' && "ai-blue-skeuo text-white",
          variant === 'secondary' && "btn-secondary",
          variant === 'peach' && "peach-skeuo",
          isDeckle && "btn-deckle",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SkeuButton.displayName = "SkeuButton"

/**
 * Reusable Specification Drawer for Button components.
 * Replicates the buttons-elements.png visual layout precisely.
 * Section 02 displays a 2D Matrix of ALL states across ALL three button variants.
 */
export const ButtonSpecDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="w-full text-xs gap-1.5 py-2 h-auto text-accent-coral border-accent-coral/20 hover:bg-accent-coral/5">
          <Info className="w-3.5 h-3.5" />
          Detail Spek Gaya Tombol
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-none bg-bg-bone border-t border-text-faint/15 rounded-t-[16px] border-x-0">
        <div className="w-full px-8 pb-8 pt-4">
          
          {/* Header */}
          <DrawerHeader className="text-left border-b border-text-faint/10 pb-4 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <DrawerTitle className="font-cinzel text-accent-coral text-xl tracking-wider">MAGURU BUTTON SPECIFICATION v2.1</DrawerTitle>
              <DrawerDescription className="text-text-muted text-caption mt-1">
                Visual spec sheet, state guide, and structural layout rules for buttons-elements.png.
              </DrawerDescription>
            </div>
            <div className="bg-accent-coral/10 text-accent-coral text-[10px] font-bold px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">
              Artisan Flat-Print Spec
            </div>
          </DrawerHeader>
          
          {/* Main Visual Grid layout replicating buttons-elements.png */}
          <div className="p-6 space-y-8 max-h-[65vh] overflow-y-auto max-w-7xl mx-auto text-text-primary">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Varian & Warna (3 cols span) */}
              <div className="lg:col-span-4 space-y-4 bg-bg-surface p-5 rounded-xl border border-text-faint/10">
                <h3 className="font-cinzel text-xs font-bold tracking-wider text-accent-coral pb-2 border-b border-text-faint/5">
                  01. VARIAN & DESAIN WARNA
                </h3>
                
                <div className="space-y-4">
                  {/* Primary Variant */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-accent-coral">PRIMARY BUTTON</span>
                      <span className="text-[10px] text-text-muted font-mono">Accent Coral (#b34d3d)</span>
                    </div>
                    <Button variant="default" className="w-full">
                      Mulai Belajar
                    </Button>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Latar belakang Coral dengan sobekan kertas organik acak, teks Fraunces, dan bayangan flat Walnut.
                    </p>
                  </div>

                  {/* Secondary Variant */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-text-primary">SECONDARY BUTTON</span>
                      <span className="text-[10px] text-text-muted font-mono">Putih (#ffffff)</span>
                    </div>
                    <Button variant="secondary" className="w-full">
                      Kembali ke Menu
                    </Button>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Latar belakang Putih dengan sobekan kertas acak, teks Fraunces, border Walnut, dan bayangan flat Coral.
                    </p>
                  </div>

                  {/* Ghost Variant */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-text-faint">GHOST BUTTON</span>
                      <span className="text-[10px] text-text-muted font-mono">Walnut Ink (#4a3a34)</span>
                    </div>
                    <Button variant="ghost" className="w-full">
                      Opsi Tambahan
                    </Button>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Latar belakang Walnut solid dengan sobekan kertas acak, teks Fraunces, dan bayangan flat Coral.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: 2D Matrix of States across all 3 variants (8 cols span) */}
              <div className="lg:col-span-8 space-y-4 bg-bg-surface p-5 rounded-xl border border-text-faint/10">
                <h3 className="font-cinzel text-xs font-bold tracking-wider text-accent-coral pb-2 border-b border-text-faint/5">
                  02. MATRIKS INTERAKSI STATE & PANDUAN VISUAL
                </h3>
                
                <div className="border border-text-faint/10 rounded-xl overflow-hidden bg-bg-bone/20">
                  <table className="w-full text-caption border-collapse text-left">
                    <thead>
                      <tr className="bg-bg-surface-accent border-b border-text-faint/10">
                        <th className="p-3 font-semibold w-24">State / Varian</th>
                        <th className="p-3 font-semibold text-center">Primary (Coral)</th>
                        <th className="p-3 font-semibold text-center">Secondary (Putih)</th>
                        <th className="p-3 font-semibold text-center">Ghost (Walnut)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-text-faint/10">
                      
                      {/* Default State */}
                      <tr>
                        <td className="p-3 font-mono font-semibold">DEFAULT</td>
                        <td className="p-3 text-center">
                          <Button variant="default" className="w-full max-w-[150px] mx-auto pointer-events-none">
                            Default
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="secondary" className="w-full max-w-[150px] mx-auto pointer-events-none">
                            Default
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="ghost" className="w-full max-w-[150px] mx-auto pointer-events-none">
                            Default
                          </Button>
                        </td>
                      </tr>

                      {/* Hover State */}
                      <tr className="bg-bg-surface-accent/20">
                        <td className="p-3 font-mono font-semibold text-accent-coral">HOVER</td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="default" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none translate-y-[-2px] shadow-[0_3px_6px_rgba(21,20,15,0.15)] brightness-[1.05]"
                          >
                            Hovered
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="secondary" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none translate-y-[-2px] shadow-[0_3px_6px_rgba(21,20,15,0.15)] bg-black/[0.02]"
                          >
                            Hovered
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="ghost" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none translate-y-[-2px] shadow-[0_3px_6px_rgba(21,20,15,0.15)] brightness-[1.12]"
                          >
                            Hovered
                          </Button>
                        </td>
                      </tr>

                      {/* Active State */}
                      <tr>
                        <td className="p-3 font-mono font-semibold">ACTIVE (Pressed)</td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="default" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none translate-y-[1px] shadow-[0_1px_1px_rgba(21,20,15,0.1)] brightness-[0.98]"
                          >
                            Pressed
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="secondary" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none translate-y-[1px] shadow-[0_1px_1px_rgba(21,20,15,0.1)] bg-black/[0.04]"
                          >
                            Pressed
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="ghost" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none translate-y-[1px] shadow-[0_1px_1px_rgba(21,20,15,0.1)] brightness-[0.95]"
                          >
                            Pressed
                          </Button>
                        </td>
                      </tr>

                      {/* Focus State */}
                      <tr className="bg-bg-surface-accent/20">
                        <td className="p-3 font-mono font-semibold">FOCUS</td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="default" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none outline outline-2 outline-accent-coral outline-offset-2"
                          >
                            Focused
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="secondary" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none outline outline-2 outline-text-primary outline-offset-2"
                          >
                            Focused
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="ghost" 
                            className="w-full max-w-[150px] mx-auto pointer-events-none transition-none outline outline-2 outline-text-primary outline-offset-2"
                          >
                            Focused
                          </Button>
                        </td>
                      </tr>

                      {/* Disabled State */}
                      <tr>
                        <td className="p-3 font-mono font-semibold">DISABLED</td>
                        <td className="p-3 text-center">
                          <Button variant="default" disabled className="w-full max-w-[150px] mx-auto">
                            Disabled
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="secondary" disabled className="w-full max-w-[150px] mx-auto">
                            Disabled
                          </Button>
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="ghost" disabled className="w-full max-w-[150px] mx-auto">
                            Disabled
                          </Button>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Bottom row: Sizes & Do's/Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-text-faint/10">
              {/* Column 3: Sizes */}
              <div className="space-y-3 bg-bg-surface p-5 rounded-xl border border-text-faint/10">
                <h3 className="font-cinzel text-xs font-bold tracking-wider text-accent-coral pb-2 border-b border-text-faint/5">
                  03. MATRIKS UKURAN & TOMBOL IKON
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-text-muted">Tinggi Default (44px)</span>
                    <Button variant="default" size="default" className="h-11">Default (h-11)</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-text-muted">Tinggi Kecil (36px)</span>
                    <Button variant="default" size="sm" className="h-9 text-xs">Small (h-9)</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-text-muted">Tombol Ikon (44x44px)</span>
                    <div className="flex gap-2">
                      <Button variant="default" size="icon" className="aspect-square p-0">
                        <Bot className="w-5 h-5 text-[#efe7d2]" />
                      </Button>
                      <Button variant="secondary" size="icon" className="aspect-square p-0">
                        <Star className="w-5 h-5 text-text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="aspect-square p-0">
                        <Award className="w-5 h-5 text-[#efe7d2]" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 4: Rules */}
              <div className="space-y-3 bg-bg-surface p-5 rounded-xl border border-text-faint/10">
                <h3 className="font-cinzel text-xs font-bold tracking-wider text-accent-coral pb-2 border-b border-text-faint/5">
                  04. PANDUAN IMPLEMENTASI (DO'S & DON'TS)
                </h3>
                
                <div className="space-y-3 text-[11px] leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-primary">Lakukan:</strong> Selalu sertakan label teks asisten suara (aria-label) pada tombol ikon tanpa teks.
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-primary">Lakukan:</strong> Gunakan opasitas tetap 38% pada state dinonaktifkan untuk memenuhi kriteria kontras WCAG 2.1.
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="w-4 h-4 text-accent-coral shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-text-primary">Hindari:</strong> Menempatkan dua tombol Coral (Primary) secara berdampingan di area layar yang sama.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <DrawerFooter className="border-t border-text-faint/10 pt-4 flex sm:flex-row justify-end gap-2 max-w-7xl mx-auto">
            <DrawerClose asChild>
              <Button variant="secondary" className="px-6 py-2.5">Tutup Spesifikasi</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
