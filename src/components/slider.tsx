import React from 'react';

interface ISliderProps {
    min: number;
    max: number;
    step: number;
    initialValue: number;
    isDisabled: boolean;

    onChange: (value: number) => void;
    onAfterChange: () => void;
}

interface IState {
    isDragging: boolean;
    value: number;
};

const roundIfDivisionError = (value: number) => {
    const decimal = value % 1;
    const divisionErrorDecimalThreshold = 0.00001;

    const isInThreshold = decimal < divisionErrorDecimalThreshold;

    if (isInThreshold) {
        return Math.round(value);
    } else {
        return value;
    }
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

        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleSliderPress = this.handleSliderPress.bind(this);
        this.handleSliderRelease = this.handleSliderRelease.bind(this);
        this.handleSliderMove = this.handleSliderMove.bind(this);

        this.calculateNewFractionPosition = this.calculateNewFractionPosition.bind(this);

        this.getValueInsideOfBounds = this.getValueInsideOfBounds.bind(this);
        this.getFractionPosition = this.getFractionPosition.bind(this);
        this.getPercentagePositionFromFraction = this.getPercentagePositionFromFraction.bind(this);

        this.sliderRef = React.createRef();

        this.state = {
            isDragging: false,
            value: 0
        };
    }

    static getDerivedStateFromProps(props: ISliderProps, state: IState) {
        const value = convertExternalValueToFraction(props.initialValue, props.min, props.max) || 0;

        if (value !== state.value) {
            return {
                ...state,
                value
            };
        } else {
            return null;
        }
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
        this.handleSliderMove(e.clientX);
    }

    mouseUpEventListener(e: MouseEvent) {
        if (this.state.isDragging) {
            e.preventDefault();
            e.stopPropagation();

            this.handleSliderPress();

            return false;
        }

        return true;
    }

    handleTouchMove(e: TouchEvent) {
        this.handleSliderMove(e.touches[0].pageX);
    }

    handleSliderPress() {
        if (this.props.isDisabled) {
            return;
        }

        this.setState({
            isDragging: true
         });
    }

    handleSliderRelease() {
        this.setState({
            isDragging: false
        }, function() {
            this.props.onAfterChange();
        });
    }

    handleSliderMove(x: number) {
        if (!this.state.isDragging) {
            return;
        }

        const fraction = this.calculateNewFractionPosition(x);
        const fractionInStep = applyStepToFraction(fraction, this.props.min, this.props.max, this.props.step);

        const externalValueInStep = convertFractionToExternalValue(fractionInStep, this.props.min, this.props.max);
        const externalValueRounded = roundIfDivisionError(externalValueInStep);

        this.setState({
            value: fraction
        }, () => {
            this.props.onChange(externalValueRounded);
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
        const handlePercentagePosition = this.getPercentagePositionFromFraction(this.state.value);

        const trackStyle = {
            visibility: 'visible',
            left: '0%',
            width: `${handlePercentagePosition}%`
        } as React.CSSProperties;

        const handleStyle = {
            left: `${handlePercentagePosition}%`
        } as React.CSSProperties;

        return (
            <div data-ecom-rangeslider="" className={this.props.isDisabled ? 'is-disabled' : ''} ref={this.sliderRef} >
                <div className="range-slider">
                    <div className="range-slider-bar">
                        <div className="range-slider-rail"></div>
                        <div className="range-slider-track" style={trackStyle}></div>
                        <div className="range-slider-handle"
                                style={handleStyle}
                                onMouseDown={this.handleSliderPress}
                                onMouseUp={this.handleSliderRelease}
                                onTouchStart={this.handleSliderPress}
                                onTouchEnd={this.handleSliderRelease}
                                onTouchMove={this.handleTouchMove} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Slider;