import { Card } from '@/components/ui/card';

export const CourseCard = ({ course, onClick, onSelect, selected }) => {
  return (
    <Card 
      className="p-6 border  hover:bg-muted transition-colors cursor-pointer"      
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect(course)}
      />
      <div className="space-y-3" onClick={onClick}>
        <h3 className="text-xl font-semibold text-foreground">{course.title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Department:</span>
            <p className="text-muted-foreground">{course.department.name}</p>
          </div>
          
          <div>
            <span className="font-medium">Duration:</span>
            <p className="text-muted-foreground">{course.duration}</p>
          </div>
          
          <div>
            <span className="font-medium">Location:</span>
            <p className="text-muted-foreground">{course.location}</p>
          </div>
          
          <div>
            <span className="font-medium">Fees:</span>
            <p className="text-muted-foreground">{course.fees}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};