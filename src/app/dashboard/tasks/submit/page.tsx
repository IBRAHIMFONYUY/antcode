import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { TaskSubmitForm } from './task-submit-form';

export default function TaskSubmitPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <TaskSubmitForm />
    </Suspense>
  );
}
