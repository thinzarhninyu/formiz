"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { QuestionType } from '@prisma/client';
import { PlusCircle, Trash, Hand } from 'lucide-react';
// import React, { ChangeEvent, useState } from 'react';
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
// import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, SortableData } from '@dnd-kit/sortable';
// import { SortableItem } from './sortable-item';

interface Question {
    id?: string;
    label: string;
    type: QuestionType;
    required: boolean;
    order: number;
    options: string[];
}

const FormCreator: React.FC<{ questions: Question[], setQuestions: React.Dispatch<React.SetStateAction<Question[]>> }> = ({ questions, setQuestions }) => {

    // const [activeId, setActiveId] = useState(null);
    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(KeyboardSensor)
    // );

    // const handleDragStart = (event: any) => {
    //     setActiveId(event.active.id);
    // };

    // const handleDragEnd = (event: any) => {
    //     const { active, over } = event;

    //     if (!over) {
    //         return;
    //     }

    //     const oldIndex = questions.findIndex((item) => item.id === active.id);
    //     const newIndex = questions.findIndex((item) => item.id === over.id);

    //     const reorderedQuestions = arrayMove(questions, oldIndex, newIndex);

    //     setQuestions(reorderedQuestions.map((question, index) => ({ ...question, order: index })));
    // };

    const addQuestion = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setQuestions(prevQuestions => [
            ...prevQuestions,
            { label: '', type: QuestionType.TEXT, required: false, options: [''], order: prevQuestions.length }
        ]);
    };

    const removeQuestion = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setQuestions(prevQuestions => {
            const newQuestions = [...prevQuestions];
            newQuestions.splice(index, 1);
            return newQuestions;
        });
    }

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newQuestions = [...questions];
        newQuestions[index].label = e.target.value;
        setQuestions(newQuestions);
    };

    const handleQuestionTypeChange = (type: QuestionType, index: number) => {
        const newQuestions = [...questions];
        newQuestions[index].type = type;
        setQuestions(newQuestions);
    };

    const handleQuestionRequiredChange = (required: boolean, index: number) => {
        const newQuestions = [...questions];
        newQuestions[index].required = required;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, questionIndex: number) => {
        const newQuestions = [...questions];
        if (!newQuestions[questionIndex].options) {
            newQuestions[questionIndex].options = [''];
        }
        newQuestions[questionIndex].options[index] = e.target.value;
        setQuestions(newQuestions);
    };

    const addOption = (e: React.MouseEvent, questionIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        setQuestions(prevQuestions => {
            const newQuestions = [...prevQuestions];
            const question = newQuestions[questionIndex];

            if (!question.options) {
                question.options = [''];
            } else {
                const lastOption = question.options[question.options.length - 1];
                if (lastOption !== '') {
                    question.options.push('');
                }
            }

            return newQuestions;
        });
    };

    const removeOption = (e: React.MouseEvent, index: number, questionIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        const newQuestions = [...questions];
        if (newQuestions[questionIndex].options) {
            newQuestions[questionIndex].options.splice(index, 1);
            setQuestions(newQuestions);
        }
    };

    return (
        <div className='flex flex-col'>
            {/* <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={questions.map(question => question.id!)}
                    strategy={verticalListSortingStrategy}
                > */}

            {questions.map((question, questionIndex) => (
                // <SortableItem key={questionIndex} id={questionIndex}>
                <div key={question.id}>
                    <div className='flex flex-row gap-x-3'>
                        {/* <Hand /> */}
                        <Input type="text" value={question.label} onChange={(e) => handleQuestionChange(e, questionIndex)} />
                        <Select onValueChange={(e: QuestionType) => handleQuestionTypeChange(e, questionIndex)} value={question.type}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Question Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={QuestionType.TEXT}>Text</SelectItem>
                                <SelectItem value={QuestionType.TEXTAREA}>Textarea</SelectItem>
                                <SelectItem value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</SelectItem>
                                <SelectItem value={QuestionType.DROPDOWN}>Dropdown</SelectItem>
                                <SelectItem value={QuestionType.CHECKBOX}>Checkbox</SelectItem>
                                {/* <SelectItem value={QuestionType.FILE}>File</SelectItem> */}
                            </SelectContent>
                        </Select>
                        <Switch checked={question.required} onCheckedChange={(e: boolean) => handleQuestionRequiredChange(e, questionIndex)} />
                        <Button onClick={(e) => removeQuestion(e, questionIndex)}><Trash className='w-5 h-5' /></Button>
                    </div>
                    {["MULTIPLE_CHOICE", "DROPDOWN"].includes(question.type) && (
                        <div className='mt-3'>
                            <div className='flex flex-row gap-x-3 items-center mb-3'>
                                <Label htmlFor="options">Options:</Label>
                                <Button onClick={(e) => addOption(e, questionIndex)}>Add Option</Button>
                            </div>
                            <div className='flex flex-col gap-y-3' >
                                {question.options && question.options.map((option, index) => (
                                    <div key={index} className='flex flex-row gap-x-3'>
                                        <Input type="text" value={option} onChange={(e) => handleOptionChange(e, index, questionIndex)} />
                                        <Button onClick={(e) => removeOption(e, index, questionIndex)}>Remove</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <Separator className='my-5' />
                </div>
                // </SortableItem>
            ))
            }
            <Button onClick={addQuestion}><PlusCircle className='w-5 h-5' /></Button>
            {/* </SortableContext> */}
            {/* </DndContext> */}
        </div>
    );
};

export default FormCreator;
