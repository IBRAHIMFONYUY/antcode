import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { FaqItem } from "@/lib/types";

type FaqProps = {
    items: FaqItem[];
};

export function Faq({ items }: FaqProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
            <AccordionItem 
              value={item.id} 
              key={item.id} 
              className={`${index === 0 ? 'border-t-0' : ''} border-border/40 hover:border-primary/30 transition-colors duration-200`}
            >
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-foreground hover:text-primary hover:no-underline px-6 py-4 transition-all duration-200 rounded-lg hover:bg-primary/5">
                    {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base px-6 py-4 bg-gradient-to-br from-white/50 to-blue-50/30 dark:from-slate-900/50 dark:to-slate-800/30 rounded-lg">
                 <p className="pb-0 leading-relaxed">{item.answer}</p>
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
  )
}
