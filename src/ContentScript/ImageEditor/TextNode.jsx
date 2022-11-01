import React from "react";
import { ResizableText } from "./ResizableText";
import { EditableTextInput } from "./EditableTextInput";
import { useState, useEffect } from "react";
const RETURN_KEY = 13;
const ESCAPE_KEY = 27;

export default function TextNode({
    isSelected,
    shapeProps,
    onSelect,
    onChange
}) {

    const [isEditing, setIsEditing] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);

    useEffect(() => {
        console.log(isSelected)
        if (!isSelected && isEditing) {
            setIsEditing(false);
        } else if (!isSelected && isTransforming) {
            setIsTransforming(false);
        }
    }, [isSelected, isEditing, isTransforming]);

    function handleEscapeKeys(e) {
        if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
            onToggleEdit(e);
        }
    }

    const onToggleEdit = () => {

        setIsEditing(!isEditing);
        // onTextClick(!isEditing);
    }

    const onToggleTransform = () => {
        setIsTransforming(!isTransforming);
        onSelect();
        // onTextClick(!isTransforming);
    }

    if (isEditing) {
        return (
            <EditableTextInput
                shapeProps={shapeProps}
                onChangeHandler={onChange}
                onKeyDown={handleEscapeKeys}
            />
        );
    }
    return (
        <ResizableText
            shapeProps={shapeProps}
            isSelected={isTransforming}
            onClick={onToggleTransform}
            onDoubleClick={onToggleEdit}
            onChangeHandler = {onChange}

        />
    );
}
