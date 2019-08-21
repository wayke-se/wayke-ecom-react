import React from 'react';

export interface ITradeInExistsChooserProps {
    onHasTradeInCarChange: (value: boolean) => void;
}

const TradeInExistsChooser = (props: ITradeInExistsChooserProps) => {
    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Har du inbytesbil?</h1>
                <div data-am-content="">
                    <p>Har du en bil du vill byta in när du köper din nya bil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-am-optionlist="">
                    <ul className="option-list">
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => props.onHasTradeInCarChange(true)}>
                                <div className="option-list-action-title">Jag har inbytesbil</div>
                            </button>
                        </li>

                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => props.onHasTradeInCarChange(false)}>
                                <div className="option-list-action-title">Jag har ingen inbytesbil</div>
                            </button>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default TradeInExistsChooser;