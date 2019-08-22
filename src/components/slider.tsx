import React from 'react';

interface ISliderProps {
    min: number;
    max: number;
    step: number;
    initialValue: number;

    onChange: (value: number) => void;
    onAfterChange: () => void;
}

interface IState {
    isDragging: boolean;
    value: number;
};

const applyStepToExternalValue = (externalValue: number, step: number) => {
    return Math.round(externalValue / step) * step;
}

const applyStepToFraction = (fraction: number, min: number, max: number, step: number) => {
    const difference = max - min;
    const n = difference / step;

    const lower = (1 / n) * Math.floor(n * fraction);
    const upper = (1 / n) * Math.ceil(n * fraction);

    const differenceToLower = fraction - lower;
    const differentToUpper = upper - fraction;

    if (differenceToLower < differentToUpper) {
        return lower;
    } else {
        return upper;
    }
}

const convertFractionToExternalValue = (fraction: number, min: number, max: number) => {
    const difference = max - min;
    return fraction * difference + min;
}

const convertExternalValueToFraction = (externalValue: number, min: number, max: number) => {
    if (!externalValue || isNaN(externalValue)) {
        return 0;
    }

    const difference = max - min;
    return (externalValue - min) / difference;
}

class Slider extends React.Component<ISliderProps, IState> {
    private sliderRef: React.RefObject<HTMLDivElement>;

    constructor(props: ISliderProps) {
        super(props);

        this.mouseMoveEventListener = this.mouseMoveEventListener.bind(this);
        this.mouseUpEventListener = this.mouseUpEventListener.bind(this);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.calculateNewFractionPosition = this.calculateNewFractionPosition.bind(this);

        this.getValueInsideOfBounds = this.getValueInsideOfBounds.bind(this);
        this.getFractionPosition = this.getFractionPosition.bind(this);
        this.getPercentagePositionFromFraction = this.getPercentagePositionFromFraction.bind(this);

        this.sliderRef = React.createRef();

        const initialValue = convertExternalValueToFraction(props.initialValue, props.min, props.max) || 0;

        this.state = {
            isDragging: false,
            value: initialValue
        };
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.mouseUpEventListener);
        window.addEventListener('mousemove', this.mouseMoveEventListener);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.mouseUpEventListener)
        window.removeEventListener('mousemove', this.mouseMoveEventListener);
    }

    mouseMoveEventListener(e: MouseEvent) {
        this.handleMouseMove(e);
    };

    mouseUpEventListener(e: MouseEvent) {
        if (this.state.isDragging) {
            e.preventDefault();
            e.stopPropagation();

            this.handleMouseUp();

            return false;
        }

        return true;
    }

    handleMouseDown() {
        this.setState({
            isDragging: true
         });
    }

    handleMouseUp() {
        this.setState({
            isDragging: false
        }, function() {
            this.props.onAfterChange();
        });
    }

    handleMouseMove(e: MouseEvent) {
        if (!this.state.isDragging) {
            return;
        }

        const fraction = this.calculateNewFractionPosition(e.clientX);
        const externalValue = convertFractionToExternalValue(fraction, this.props.min, this.props.max);

        const externalValueInStep = applyStepToExternalValue(externalValue, this.props.step);

        this.setState({
            value: fraction
        }, () => {
            this.props.onChange(externalValueInStep);
        })
    }

    calculateNewFractionPosition(x: number) {
        const boundaryMin = this.sliderRef.current.getBoundingClientRect().left;
        const boundaryMax = this.sliderRef.current.getBoundingClientRect().right;

        const valueInsideOfBounds = this.getValueInsideOfBounds(x, boundaryMin, boundaryMax);
        return this.getFractionPosition(valueInsideOfBounds, boundaryMin, boundaryMax);
    }

    getValueInsideOfBounds(value: number, min: number, max: number) {
        const isLessThanMin = value < min;
        const isMoreThanMax = value > max;

        if (isLessThanMin) {
            return min;
        } else if (isMoreThanMax) {
            return max;
        } else {
            return value;
        }
    }

    getFractionPosition(value: number, min: number, max: number) {
        const newValue = value - min;
        const newMax = max - min;

        return newValue / newMax;
    }

    getPercentagePositionFromFraction(fraction: number) {
        const fractionWithStep = applyStepToFraction(fraction, this.props.min, this.props.max, this.props.step);
        return fractionWithStep * 100;
    }

    render() {
        const trackStyle = {
            visibility: 'visible',
            left: '0%',
            width: '100%'
        } as React.CSSProperties;

        const handlePercentagePosition = this.getPercentagePositionFromFraction(this.state.value);

        const handleStyle = {
            left: `${handlePercentagePosition}%`
        } as React.CSSProperties;

        return (
            <div ref={this.sliderRef} className="rc-slider">
                <div className="rc-slider-rail"></div>
                <div className="rc-slider-track rc-slider-track-1" style={trackStyle}></div>
                <div className="rc-slider-step"></div>
                <div className="rc-slider-handle rc-slider-handle-1"
                        style={handleStyle}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}>
                </div>
                <div className="rc-slider-mark"></div>
            </div>
        );
    }
}

export default Slider;